import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Subject} from 'rxjs';

import {User, LoginData, RegisterData} from '../models';
import {ApiService} from './api.service';
import {JwtService} from './jwt.service';
import {environment} from 'src/environments/environment';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private http: HttpClient,
        private router: Router,
        private apiService: ApiService,
        private jwtService: JwtService,
    ) {}

    user: User;
    user$ = new BehaviorSubject<User>(null);
    auth$ = new BehaviorSubject<boolean>(false);
    isAuthFetched$ = new BehaviorSubject<boolean>(false);

    setUser(user: User | null) {
        this.user = user;
        console.log('in service', user)
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
                    console.log(user);
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
            if (this.user) {
                console.log('User already auth');
                resolve(this.user);
            }
            this.isAuthFetched$.pipe(filter((fetched: boolean) => fetched))
                .subscribe(() => {
                    return this.user
                        ? resolve(this.user)
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
