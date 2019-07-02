import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import {AngularFireStorage} from '@angular/fire/storage';
import {ContactCreateService} from './contact-create.service';
import {Router} from '@angular/router';
import {ContactsService} from '../../../core/services/contacts.service';
import {ContactItem} from '../../../core/models/ContactItem.model';

@Component({
    selector: 'app-contact-create',
    templateUrl: './contact-create.component.html',
    styleUrls: ['./contact-create.component.scss'],
    providers: [ContactCreateService],
})
export class ContactCreateComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private fireStorage: AngularFireStorage,
        private contactCreateService: ContactCreateService,
        private router: Router,
        private contactService: ContactsService,
    ) {}

    sendingData = false;
    avatarImage: string | ArrayBuffer | null = null;
    fileRef: any = null;
    contactForm = this.fb.group({
        avatar: [null],
        name: ['', Validators.required],
        phone: ['+380', [Validators.required, Validators.pattern(/^[+]{1}[0-9]{12}$/)]],
        email: [null, this.customEmailValidator],
        company: [null],
    });

    ngOnInit() {}

    customEmailValidator(control: AbstractControl): ValidationErrors {
        if (!control.value) {
            return null;
        }
        const isValid = /\S+@\S+\.\S+/.test(control.value);
        return isValid ? null : {email: true};
    }

    onSubmit() {
        this.sendingData = true;
        if (this.contactForm.get('avatar').value) {
            this.uploadAvatarToFirebase();
        } else {
            this.sendToServer();
        }
    }

    uploadAvatarToFirebase() {
        const file = this.contactForm.get('avatar').value;
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
        } else {
            delete contactData.avatar;
        }

        this.contactCreateService.create(contactData).subscribe(
            (result: ContactItem) => {
                console.log(result);
                this.sendingData = false;
                this.contactService.addContact(result);
                this.router.navigate(['/contacts']);
            },
            error => {
                this.sendingData = false;
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
        if (this.fileRef) {
            this.fileRef.delete().then(() => {
                console.log('File deleted successfully');
                this.fileRef = null;
            });
        }
    }

    onShowData() {
        console.log(this.contactForm);
    }

    onFileChange(event) {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            reader.readAsDataURL(file);

            reader.onload = () => {
                this.avatarImage = reader.result;
                this.contactForm.patchValue({
                    avatar: file,
                });
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
