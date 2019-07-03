import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormGroup, ValidationErrors} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthService} from '../../../core/services';
import {User, RegisterErrorResponse} from '../../../core/models';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

    fetchingUser = false;
    registerForm = this.fb.group(
        {
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            passwordConfirm: ['', Validators.required],
        },
        {validators: this.passwordConfirmed},
    );

    ngOnInit() {}

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
        this.fetchingUser = true;
        this.authService.register(this.registerForm.value).subscribe(
            (response: {token: string; user: User}) => {
                this.authService.user = response.user;
                this.authService.isLogedIn = true;
                this.fetchingUser = false;
                localStorage.setItem('token', response.token);
                this.router.navigate(['/contacts']);
            },
            error => {
                this.fetchingUser = false;
                if (error.error) {
                    this.setError(error.error);
                }
                console.log(error);
            },
        );
    }

    setError(errors: [RegisterErrorResponse]) {
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
