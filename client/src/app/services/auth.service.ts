import {Injectable} from '@angular/core';
import { Router } from '@angular/router';

import { User } from './../models/User.model';
import { LoginData } from './../models/LoginData.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RegisterData } from './../models/RegisterData.model';


@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private http: HttpClient,
        private router: Router,
    ) {}

    isLogedIn: boolean = false;
    fetchingUser: boolean = true;
    user: null | User = null;

    setOptions() {
        return {
            headers: new HttpHeaders({
                Authorization: `Bearer ${localStorage.getItem(`token`)}`,
                'Content-Type': 'application/json',
            })
        }
    }

    getUser() {
        this.http.get(`${environment.BASE_URL}/auth`, this.setOptions())
            .subscribe(
                (user: User) => {
                    console.log(user);
                    this.user = user;
                    this.isLogedIn = true;
                    this.fetchingUser = false;
                    this.router.navigate(['/contacts'])
                },
                error => {
                    console.log(error)
                    localStorage.removeItem('token');
                    this.fetchingUser = false;
                    this.router.navigate(['/login'])
                },
            )
    }

    login(data: LoginData) {
        return this.http.post(`${environment.BASE_URL}/auth/login`, data, this.setOptions())
    }

    register(data: RegisterData) {
        return this.http.post(`${environment.BASE_URL}/auth/register`, data, this.setOptions())
    }

    logout() {
        localStorage.removeItem('token');
        this.isLogedIn = false;
        this.user = null;
        this.router.navigate(['/login'])
    }

    isAuth(): boolean {
        return this.isLogedIn;
    }
}
