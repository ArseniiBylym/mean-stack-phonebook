import {Injectable} from '@angular/core';
import {AuthService} from './core/services';
import {Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError} from '@angular/router';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AppService {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    loading$ = new Subject<boolean>();

    routerEventHandler(event: RouterEvent) {
        if (event instanceof NavigationStart) {
            this.loading$.next(true);
        }
        if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
            this.loading$.next(false);
        }
    }
}
