import {Injectable} from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services';
import { BehaviorSubject, Subject } from 'rxjs';
import { LoginErrorResponse, LoginData, User } from 'src/app/core/models';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/core/services/jwt.service';

@Injectable()
export class LoginService {
    constructor(
        private apiService: ApiService,
        private authService: AuthService,
        private router: Router,
        private jwtService: JwtService,
    ) {}

    sending$ = new BehaviorSubject<boolean>(false);
    errors$ = new BehaviorSubject<LoginErrorResponse>(null);

    loginSuccess(data: {token: string, user: User}) {
        this.sending$.next(false);
        this.authService.authSuccess(data.user);
        this.jwtService.saveToken(data.token);
        this.router.navigate(['/contacts']);
    }

    loginFailed(error) {
        console.log(error);
        this.sending$.next(false);
        if (error.validation) {
            this.errors$.next(error);
        }
    }

    login(data: LoginData) {
        this.sending$.next(true);
        this.apiService.post('/auth/login', data)
            .subscribe(
                (result: {token: string, user: User}) => {
                    this.loginSuccess(result);
                },
                (error: LoginErrorResponse) => {
                    this.loginFailed(error);
                }
            );
    }
}
