import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild, Router} from '@angular/router';
import {Observable} from 'rxjs';
import { AuthService } from 'src/app/core/services';
import { take, map, tap } from 'rxjs/operators';

@Injectable()
export class NoAuthGuard implements CanActivate, CanActivateChild {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.auth$.pipe(
            take(1),
            tap(isAuth => {
                if (isAuth) {
                    this.router.navigate(['/contacts']);
                }
            }),
            map(auth => !auth));
    }

    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.canActivate(next, state);
    }
}
