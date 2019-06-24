import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators, ValidatorFn, AbstractControl} from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    constructor(private fb: FormBuilder) {}

    ngOnInit() {}

    passwordConfirmed(): ValidatorFn {
        return (c: AbstractControl) : {[key: string]: boolean} | null => {
            if (c.parent) {
                if (c.parent.get('password').value !== c.parent.get('passwordConfirm').value) {
                        return {'match': true}
                    }
                return null
            }
            return null;
        }
    }

    registerForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        passwordConfirm: ['', [Validators.required, this.passwordConfirmed()]],
    });

    onSubmit() {
        console.log(this.registerForm);
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
                break;
            case 'email':
                if (this.registerForm.controls[fieldName].errors.required) {
                    return 'Email is required';
                }
                if (this.registerForm.controls[fieldName].errors.email) {
                    return 'Email should be a valid email address';
                }
                break;
            case 'password':
                if (this.registerForm.controls[fieldName].errors.required) {
                    return 'Password is required';
                }
                break;
            case 'passwordConfirm':
                    if (this.registerForm.controls[fieldName].errors.required) {
                        return 'Password confirm is required';
                    }
                    if (this.registerForm.controls[fieldName].errors.match) {
                        return 'Password does not matches';
                    }
                    break;
            default:
                break;
        }
    }
}
