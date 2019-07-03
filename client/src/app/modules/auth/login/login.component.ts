import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {FormBuilder, Validators} from '@angular/forms';
import {User, LoginErrorResponse} from '../../../core/models';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { BehaviorSubject, Observable } from 'rxjs';

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
        this.errors$.subscribe(
                (errors: LoginErrorResponse) => {
                    console.log(errors);
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
