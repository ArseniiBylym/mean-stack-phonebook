import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild} from '@angular/router';
import {Observable} from 'rxjs';
import { AuthService } from 'src/app/core/services';
import { take, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class NoAuthGuard implements CanActivate, CanActivateChild {
    constructor(private authService: AuthService) {}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.auth$.pipe(
            take(1),
            map(isAuth => !isAuth),
        );
    }
    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.canActivate(next, state);
    }
}
