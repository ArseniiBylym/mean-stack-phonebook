import {Injectable} from '@angular/core';
import { User } from './../models/User.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor() {}

    isLogedIn: boolean = false;
    user: null | User = null;

    login(): void {
        this.isLogedIn = true;
    }

    logout(): void {
        this.isLogedIn = false;
        this.user = null;
    }

    isAuth(): boolean {
        return this.isLogedIn;
    }
}
