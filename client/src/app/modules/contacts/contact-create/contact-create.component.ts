import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

import { RegisterErrorResponse } from 'src/app/core/models';
import {ContactsService} from '../contacts.service';
import {ContactCreateService} from './contact-create.service';

@Component({
    selector: 'app-contact-create',
    templateUrl: './contact-create.component.html',
    styleUrls: ['./contact-create.component.scss'],
    providers: [ContactCreateService],
})
export class ContactCreateComponent implements OnInit, OnDestroy {
    constructor(
        private fb: FormBuilder,
        private contactsService: ContactsService,
        private contactCreateService: ContactCreateService,
    ) {}

    loading: boolean;
    loadingSub$: Subscription;
    errorsSub$: Subscription;

    avatarImage: string | ArrayBuffer | null = null;
    contactForm = this.fb.group({
        avatar: [null],
        name: ['', Validators.required],
        phone: ['+380', [Validators.required, Validators.pattern(/^[+]{1}[0-9]{12}$/)]],
        email: [null, this.customEmailValidator],
        company: [null],
    });

    ngOnInit() {
        this.errorsSub$ = this.contactsService.loading$.subscribe(isLoading => (this.loading = isLoading));

        this.errorsSub$ = this.contactsService.createErrors$
            .pipe(
                filter(error => !!error),
            )
            .subscribe(errors => {
                this.serverErrorHandler(errors);
            });
    }

    ngOnDestroy() {
        this.errorsSub$.unsubscribe();
        this.errorsSub$.unsubscribe();
    }

    customEmailValidator(control: AbstractControl): ValidationErrors {
        if (!control.value) {
            return null;
        }
        const isValid = /\S+@\S+\.\S+/.test(control.value);
        return isValid ? null : {email: true};
    }

    onSubmit() {
        this.contactCreateService.createContact(this.contactForm.value);
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
