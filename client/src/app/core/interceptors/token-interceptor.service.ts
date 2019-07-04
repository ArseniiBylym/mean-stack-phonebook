import {Injectable} from '@angular/core';
import {JwtService} from '../services/jwt.service';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
    constructor(private jwtService: JwtService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.jwtService.getToken();

        const headers = token
            ? new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            })
            : new HttpHeaders({
                'Content-Type': 'application/json',
            });

        const request = req.clone({headers});
        return next.handle(request);
    }
}
