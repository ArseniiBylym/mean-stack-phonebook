import {Component, OnInit, OnDestroy} from '@angular/core';
import {ContactsService} from '../contacts.service';
import {ContactItem, RegisterErrorResponse} from 'src/app/core/models';
import {FormBuilder, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ContactEditService } from './contact-edit.service';

@Component({
    selector: 'app-contact-edit',
    templateUrl: './contact-edit.component.html',
    styleUrls: ['./contact-edit.component.scss'],
    providers: [ContactEditService]
})
export class ContactEditComponent implements OnInit, OnDestroy {
    constructor(
        private fb: FormBuilder,
        private contactsService: ContactsService,
        private contactEditService: ContactEditService,
    ) {}

    contact: ContactItem;
    loading: boolean;
    contactSub$: Subscription;
    loadingSub$: Subscription;
    errorsSub$: Subscription;

    avatarImage: string | ArrayBuffer | null = null;
    imageFile: any = null;
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
        this.loadingSub$ = this.contactsService.loading$
            .subscribe((isLoading: boolean) => this.loading = isLoading);
        this.contactSub$ = this.contactsService.selectedContact$.pipe(filter((item: ContactItem) => !!item))
            .subscribe(
                (contact: ContactItem) => {
                    this.contact = contact;
                    this.formSeed();
                }
            );
        this.errorsSub$ = this.contactsService.updateErrors$
            .pipe(
                filter(error => !!error),
            )
            .subscribe(
                errors => {
                    this.serverErrorHandler(errors);
                }
            );
    }

    ngOnDestroy() {
        this.contactSub$.unsubscribe();
        this.errorsSub$.unsubscribe();
        this.loadingSub$.unsubscribe();
    }

    formSeed() {
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
        if (this.imageFile) {
            this.contactEditService.updateContact({image: this.imageFile, contact: this.contactForm.value});
        } else {
            this.contactEditService.updateContact({contact: this.contactForm.value});
        }
    }

    serverErrorHandler(serverError: RegisterErrorResponse[]) {
        serverError.forEach(error => {
            this.contactForm.controls[error.param].setErrors({
                serverValidation: {
                    value: true,
                    message: error.msg,
                },
            });
        });
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
