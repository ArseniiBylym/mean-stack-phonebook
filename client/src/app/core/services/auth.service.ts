import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

import {User} from '../models';
import {ApiService} from './api.service';
import {JwtService} from './jwt.service';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private router: Router,
        private apiService: ApiService,
        private jwtService: JwtService,
    ) {}

    user$ = new BehaviorSubject<User>(null);
    auth$ = new BehaviorSubject<boolean>(false);
    isAuthFetched$ = new BehaviorSubject<boolean>(false);

    setUser(user: User | null) {
        this.user$.next(user);
    }

    authSuccess(user: User) {
        this.setUser(user);
        this.auth$.next(true);
        this.isAuthFetched$.next(true);
    }

    authFailed() {
        this.setUser(null);
        this.auth$.next(false);
        this.isAuthFetched$.next(false);
        this.jwtService.deleteToken();
        this.router.navigate(['/auth/login']);
    }

    authUser() {
        if (this.jwtService.getToken()) {
            this.apiService.get('/auth').subscribe(
                user => {
                    return this.authSuccess(user);
                },
                error => this.authFailed(),
            );
        } else {
            this.authFailed();
        }
    }

    getUser() {
        return new Promise((resolve, reject) => {
            if (this.user$.value) {
                console.log('User already auth');
                resolve(this.user$.value);
            }
            this.isAuthFetched$.pipe(filter((fetched: boolean) => fetched))
                .subscribe(() => {
                    return this.user$.value
                        ? resolve(this.user$.value)
                        : reject();
                });
        });
    }

    logout() {
        this.jwtService.deleteToken();
        this.setUser(null);
        this.auth$.next(false);
        this.router.navigate(['/auth/login']);
    }
}
