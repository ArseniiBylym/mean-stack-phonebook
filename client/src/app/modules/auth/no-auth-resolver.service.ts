import {Injectable} from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/core/services';
import { Observable} from 'rxjs';
import { combineLatest } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

@Injectable()
export class NoAuthResolverService {
    constructor(
        private router: Router,
        private authService: AuthService,
        ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean> | Observable<never> | Promise<any> {
        return combineLatest(
            this.authService.auth$,
            this.authService.isAuthFetched$
        ).pipe(
            filter(([auth, fetched]) => fetched),
            take(1),
            tap(([auth, fetched]) => {
                if (fetched && auth) {
                    this.router.navigate(['/contacts']);
                }
            }),
            map(() => true)
        );
    }
}
