import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { User } from './../models/User.model';
import { LoginData } from './../models/LoginData.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import axios from 'axios';
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
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
        withCredentials: true,
    } 

    getUser() {
        this.http.get<User>(`${environment.BASE_URL}/auth`, this.httpOptions)
            .subscribe(
                (result: User) => {
                    console.log(result);
                    this.user = result;
                    this.isLogedIn = true;
                    this.fetchingUser = false;
                    this.router.navigate(['/contacts'])
                },
                error => {
                    console.log(error)
                    this.fetchingUser = false;
                    this.router.navigate(['/login'])
                },
            )
    }

    login(data: LoginData) {
        return this.http.post<User>(`${environment.BASE_URL}/auth/login`, data, this.httpOptions)
    }

    register(data: RegisterData) {
        return this.http.post<User>(`${environment.BASE_URL}/auth/register`, data, this.httpOptions)
    }

    logout() {
        this.http.get<string>(`${environment.BASE_URL}/auth/logout`, this.httpOptions)
            .subscribe(
                (res: string) => {
                    console.log(res)
                    this.isLogedIn = false;
                    this.user = null;
                    this.router.navigate(['/login'])
                },
                error => console.log(error)
            )
    }

    isAuth(): boolean {
        return this.isLogedIn;
    }
}
