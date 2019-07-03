import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class JwtService {
    constructor() {}

    getToken(): string | undefined {
        return localStorage.getItem('token');
    }

    saveToken(token: string) {
        localStorage.setItem('token', token);
    }

    deleteToken(): void {
        localStorage.removeItem('token');
    }
}
