import {Injectable} from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/core/services/jwt.service';
import { Subject } from 'rxjs';
import { RegisterErrorResponse, User, RegisterData } from 'src/app/core/models';

@Injectable()
export class RegisterService {
    constructor(
        private apiService: ApiService,
        private authService: AuthService,
        private router: Router,
        private jwtService: JwtService,
    ) {}

    sending$ = new Subject<boolean>();
    errors$ = new Subject<RegisterErrorResponse[]>();

    registerSuccess(data: {token: string, user: User}) {
        this.sending$.next(false);
        this.authService.authSuccess(data.user);
        this.jwtService.saveToken(data.token);
        this.router.navigate(['/contacts']);
    }

    registerFailed(error) {
        console.log(error);
        this.sending$.next(false);
        if (error.length) {
            this.errors$.next(error);
        }
    }

    register(data: RegisterData) {
        this.sending$.next(true);
        this.apiService.post('/auth/register', data)
            .subscribe(
                (result: {token: string, user: User}) => {
                    this.registerSuccess(result);
                },
                (error: RegisterErrorResponse) => {
                    this.registerFailed(error);
                }
            );
    }
}