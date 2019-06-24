import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
    constructor(
        private router: Router,
        private authService: AuthService,
    ) {}

    

    onLogout() {
        this.authService.logout();
    }

    ngOnInit() {}
}
