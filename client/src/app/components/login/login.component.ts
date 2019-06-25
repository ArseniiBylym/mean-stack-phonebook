import {Component, OnInit} from '@angular/core';
import {AuthService} from './../../services/auth.service';
import {FormBuilder, Validators} from '@angular/forms';
import {User} from '../../models/User.model'
import { LoginErrorResponse } from './../../models/LoginErrorResponse.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    constructor(
        private authService: AuthService, 
        private fb: FormBuilder,
        private router: Router,
    ) {}

    fetchingUser: boolean = false;

    ngOnInit() {}

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
    });

    onSubmit() {
        this.fetchingUser = true;
        this.authService.login(this.loginForm.value)
            .subscribe(
                (result: User) => {
                    console.log(result);
                    this.authService.user = result;
                    this.authService.isLogedIn = true;
                    this.fetchingUser = false;
                    this.router.navigate(['/contacts'])
                },
                error => {
                    this.fetchingUser = false;
                    if (error.error.validation) {
                        this.setError(error.error)
                    }
                    console.log('Ups, something went wrong', error)
                },
            )
    }

    setError(error: LoginErrorResponse) {
        this.loginForm.controls[error.fieldName].setErrors({'serverValidation': {
            value: true, 
            message: error.errorMessage
        }})
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
                    return this.loginForm.controls[fieldName].errors.serverValidation.message
                }
                break;
            case 'password':
                if (this.loginForm.controls[fieldName].errors.required) {
                    return 'Password is required';
                }
                if (this.loginForm.controls[fieldName].errors.serverValidation) {
                    return this.loginForm.controls[fieldName].errors.serverValidation.message
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
