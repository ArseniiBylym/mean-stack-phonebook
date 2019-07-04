import {Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models';
import { AuthService } from 'src/app/core/services';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    constructor(
        private authService: AuthService
    ) {}

    user$: Observable<User>;

    ngOnInit() {
        this.user$ = this.authService.user$.pipe(filter(user => !!user));
    }

    onLogout() {
        this.authService.logout();
    }
}
