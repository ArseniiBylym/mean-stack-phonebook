import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormGroup, ValidationErrors} from '@angular/forms';
import { Observable } from 'rxjs';

import { RegisterErrorResponse} from '../../../core/models';
import { RegisterService } from './register.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    providers: [RegisterService],
})
export class RegisterComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private registerService: RegisterService
    ) {}

    sending$: Observable<boolean>;
    errors$: Observable<RegisterErrorResponse[]>;
    registerForm = this.fb.group(
        {
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            passwordConfirm: ['', Validators.required],
        },
        {validators: this.passwordConfirmed},
    );

    ngOnInit() {
        this.sending$ = this.registerService.sending$.asObservable();
        this.errors$ = this.registerService.errors$.asObservable();
        this.errors$.subscribe(
                (errors: RegisterErrorResponse[]) => {
                    console.log(errors);
                    this.setErrors(errors);
                }
            );
    }

    passwordConfirmed(control: FormGroup): ValidationErrors | null {
        const password = control.get('password');
        const passwordConfirm = control.get('passwordConfirm');
        if (password && passwordConfirm && password.value !== passwordConfirm.value) {
            control.controls.passwordConfirm.setErrors({match: true});
            return {match: true};
        }
        control.controls.passwordConfirm.setErrors(null);
        return null;
    }

    onSubmit() {
        this.registerService.register(this.registerForm.value);
    }

    setErrors(errors: RegisterErrorResponse[]) {
        errors.forEach(error => {
            this.registerForm.controls[error.param].setErrors({
                serverValidation: {
                    value: true,
                    message: error.msg,
                },
            });
        });
    }

    isInputValid(fieldName: string) {
        return this.registerForm.controls[fieldName].touched && this.registerForm.controls[fieldName].invalid;
    }

    getValidationErrorMessage(fieldName: string) {
        switch (fieldName) {
            case 'name':
                if (this.registerForm.controls[fieldName].errors.required) {
                    return 'Name is required';
                }
                if (this.registerForm.controls[fieldName].errors.serverValidation) {
                    return this.registerForm.controls[fieldName].errors.serverValidation.message;
                }
                break;
            case 'email':
                if (this.registerForm.controls[fieldName].errors.required) {
                    return 'Email is required';
                }
                if (this.registerForm.controls[fieldName].errors.email) {
                    return 'Email should be a valid email address';
                }
                if (this.registerForm.controls[fieldName].errors.serverValidation) {
                    return this.registerForm.controls[fieldName].errors.serverValidation.message;
                }
                break;
            case 'password':
                if (this.registerForm.controls[fieldName].errors.required) {
                    return 'Password is required';
                }
                if (this.registerForm.controls[fieldName].errors.serverValidation) {
                    return this.registerForm.controls[fieldName].errors.serverValidation.message;
                }
                break;
            case 'passwordConfirm':
                if (this.registerForm.controls[fieldName].errors.required) {
                    return 'Password confirm is required';
                }
                if (this.registerForm.controls[fieldName].errors.match) {
                    return 'Password does not matches';
                }
                if (this.registerForm.controls[fieldName].errors.serverValidation) {
                    return this.registerForm.controls[fieldName].errors.serverValidation.message;
                }
                break;
            default:
                break;
        }
    }
}
