import { Component, OnInit } from '@angular/core';

import { AuthService } from './core/services';
import { AppService } from './app.service';
import { Router, RouterEvent } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private appService: AppService,
        private router: Router,
    ) {}

    loading: boolean;

    ngOnInit() {
        this.authService.authUser();

        this.appService.loading$.subscribe(status => {
            this.loading = status;
          });
        this.router.events.subscribe((routerEvent: RouterEvent) => {
            this.appService.routerEventHandler(routerEvent);
        });
    }
}
