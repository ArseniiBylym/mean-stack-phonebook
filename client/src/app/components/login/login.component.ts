import {Component, OnInit} from '@angular/core';
import {AuthService} from './../../services/auth.service';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    constructor(
        private authService: AuthService, 
        private fb: FormBuilder
    ) {}

    ngOnInit() {}

    loginForm = this.fb.group({
        email: ['admin@gmail.com', [Validators.required, Validators.email]],
        password: ['admin', Validators.required],
    });

    onSubmit() {
        this.authService.login(this.loginForm.value)
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
                break;
            case 'password':
                if (this.loginForm.controls[fieldName].errors.required) {
                    return 'Password is required';
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
