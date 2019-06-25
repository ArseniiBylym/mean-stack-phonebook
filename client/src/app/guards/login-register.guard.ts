import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class LoginRegisterGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkLogin()
    }

    checkLogin():boolean {
        if (this.authService.isAuth()) {
            this.router.navigate(['/contacts']);
            return false;
        } else {
            if (this.authService.fetchingUser) {
                this.router.navigate(['/'])
                return false
            } else {
                return true
            }
        }
    }
}
