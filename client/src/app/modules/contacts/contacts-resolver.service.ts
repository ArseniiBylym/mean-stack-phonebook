import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AuthService } from 'src/app/core/services';
import { Observable, EMPTY, of } from 'rxjs';
import { User } from 'src/app/core/models';

@Injectable({
    providedIn: 'root'
})
export class ContactsResolverService implements Resolve<any> {
    constructor(
        private router: Router,
        private authService: AuthService,
    ) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean> | Observable<never> | Promise<any> {
        return this.authService
            .getUser()
            .then((user: User) => {
                console.log('User fetched');
                return of(user);
            })
            .catch(() => {
                console.log('User fetching failed');
                this.router.navigate(['/auth/login']);
                return EMPTY;
            });
    }
}
