import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services';
import { ContactsService } from './contacts.service';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private contactsService: ContactsService
    ) {}

    onLogout() {
        this.authService.logout();
    }

    ngOnInit() {
        this.contactsService.get();
    }
}
