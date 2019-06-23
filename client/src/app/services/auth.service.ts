import {Injectable} from '@angular/core';
import { User } from './../models/User.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor() {}

    isAuth: boolean = false;
    user: null | User = null;

    loginUser() {
        this.isAuth = true;
    }

    logoutUser() {
        this.isAuth = false;
        this.user = null;
    }
}
