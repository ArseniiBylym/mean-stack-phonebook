import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { LoginErrorResponse} from '../../../core/models';
import { LoginService } from './login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [LoginService]
})
export class LoginComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService,
    ) {}

    sending$: Observable<boolean>;
    errors$: Observable<LoginErrorResponse>;
    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
    });

    ngOnInit() {
        this.sending$ = this.loginService.sending$.asObservable();
        this.errors$ = this.loginService.errors$.asObservable();
        this.errors$.pipe(filter(error => !!error)).subscribe(
                (errors: LoginErrorResponse) => {
                    this.setErrors(errors);
                }
            );
    }
    onSubmit() {
        this.loginService.login(this.loginForm.value);
    }

    setErrors(error: LoginErrorResponse) {
        this.loginForm.controls[error.fieldName].setErrors({serverValidation: {
            value: true,
            message: error.errorMessage
        }});
        this.loginForm.controls[error.fieldName].markAsTouched();
    }

    getValidationErrorMessage(fieldName: string) {
        switch (fieldName) {
            case 'email':
                if (this.loginForm.controls[fieldName].errors.required) {
                    return 'Email is required';
                }
                if (this.loginForm.controls[fieldName].errors.email) {
                    return 'Email should be a valid email address'
                }
                if (this.loginForm.controls[fieldName].errors.serverValidation) {
                    return this.loginForm.controls[fieldName].errors.serverValidation.message;
                }
                break;
            case 'password':
                if (this.loginForm.controls[fieldName].errors.required) {
                    return 'Password is required';
                }
                if (this.loginForm.controls[fieldName].errors.serverValidation) {
                    return this.loginForm.controls[fieldName].errors.serverValidation.message;
                }
                break;
            default:
                break;
        }
    }

    isInputValid(fieldName: string) {
        return this.loginForm.controls[fieldName].touched && this.loginForm.controls[fieldName].invalid;
    }
}
