import {Component, OnInit} from '@angular/core';
import {ContactsService} from '../../../core/services/contacts.service';
import {ContactItem} from 'src/app/core/models/ContactItem.model';
import {FormBuilder, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import {AngularFireStorage} from '@angular/fire/storage';
import {Router} from '@angular/router';

@Component({
    selector: 'app-contact-edit',
    templateUrl: './contact-edit.component.html',
    styleUrls: ['./contact-edit.component.scss'],
})
export class ContactEditComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private fireStorage: AngularFireStorage,
        private router: Router,
        private contactsService: ContactsService,
    ) {}

    contact: ContactItem;
    updatingData = false;
    avatarImage: string | ArrayBuffer | null = null;
    imageFile: any = null;
    fileRef: any = null;
    contactForm = this.fb.group({
        avatar: [null],
        name: [null, Validators.required],
        phone: [null, [Validators.required, Validators.pattern(/^[+]{1}[0-9]{12}$/)]],
        email: [null, this.customEmailValidator],
        company: [null],
    });

    customEmailValidator(control: AbstractControl): ValidationErrors {
        if (!control.value) {
            return null;
        }
        const isValid = /\S+@\S+\.\S+/.test(control.value);
        return isValid ? null : {email: true};
    }

    ngOnInit() {
        this.contact = this.contactsService.selectedContact;
        this.contactForm.patchValue({
            avatar: this.contact.avatar,
            name: this.contact.name,
            phone: this.contact.phone,
            email: this.contact.email || null,
            company: this.contact.company || null,
        });
        this.avatarImage = this.contact.avatar;
    }

    onSubmit() {
        this.updatingData = true;
        if (this.imageFile) {
            this.uploadAvatarToFirebase();
        } else {
            this.sendToServer();
        }
    }

    uploadAvatarToFirebase() {
        const file = this.imageFile;
        const phone = this.contactForm.get('phone').value;
        const name = this.contactForm.get('name').value;
        const filePath = `/avatars/${name}_${phone}`;
        this.fileRef = this.fireStorage.ref(filePath);
        this.fileRef
            .put(file)
            .then(snapshot => {
                return snapshot.ref.getDownloadURL();
            })
            .then(url => {
                this.sendToServer(url);
            });
    }

    onShowData() {
        console.log(this.contactForm);
    }

    sendToServer(avatarUrl?: string) {
        const contactData = Object.assign({}, this.contactForm.value);
        if (!contactData.email) {
            delete contactData.email;
        }
        if (!contactData.company) {
            delete contactData.company;
        }
        if (avatarUrl) {
            contactData.avatar = avatarUrl;
        }

        this.contactsService.updataContactOnServer(contactData).subscribe(
            (result: ContactItem) => {
                console.log(result);
                this.updatingData = false;
                this.contactsService.updateContact(result);
                this.router.navigate(['/contacts', this.contact._id]);
            },
            error => {
                this.updatingData = false;
                this.serverErrorHandler(error);
            },
        );
    }

    serverErrorHandler(serverError) {
        console.log(serverError);
        if (serverError.error) {
            serverError.error.forEach(error => {
                this.contactForm.controls[error.param].setErrors({
                    serverValidation: {
                        value: true,
                        message: error.msg,
                    },
                });
            });
        }
    }

    onFileChange(event) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            reader.readAsDataURL(file);

            reader.onload = () => {
                this.avatarImage = reader.result;
                this.imageFile = file;
            };
        }
    }

    isInputValid(fieldName: string) {
        return this.contactForm.controls[fieldName].touched && this.contactForm.controls[fieldName].invalid;
    }

    getValidationErrorMessage(fieldName: string) {
        switch (fieldName) {
            case 'name': {
                if (this.contactForm.controls[fieldName].errors.required) {
                    return 'Name is required';
                }
                if (this.contactForm.controls[fieldName].errors.serverValidation) {
                    return this.contactForm.controls[fieldName].errors.serverValidation.message;
                }
                break;
            }
            case 'email':
                if (this.contactForm.controls[fieldName].errors.required) {
                    return 'Email is required';
                }
                if (this.contactForm.controls[fieldName].errors.email) {
                    return 'Email should be a valid email address';
                }
                if (this.contactForm.controls[fieldName].errors.serverValidation) {
                    return this.contactForm.controls[fieldName].errors.serverValidation.message;
                }
                break;
            case 'phone':
                if (this.contactForm.controls[fieldName].errors.required) {
                    return 'Phone is required';
                }
                if (this.contactForm.controls[fieldName].errors.pattern) {
                    return 'Phone should be a valid phone number';
                }
                if (this.contactForm.controls[fieldName].errors.serverValidation) {
                    return this.contactForm.controls[fieldName].errors.serverValidation.message;
                }
                break;
            default:
                break;
        }
    }
}
