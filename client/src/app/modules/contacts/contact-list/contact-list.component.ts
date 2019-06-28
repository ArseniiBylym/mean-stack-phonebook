import {Component, OnInit} from '@angular/core';
import {ContactsService} from './../../../services/contacts.service';
import { Subscription } from 'rxjs';
import { ContactItem } from './../../../models/ContactItem.model';

@Component({
    selector: 'app-contact-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
    contacts: ContactItem[];
    contactsSub: Subscription;

    constructor(
        private contactsService: ContactsService
    ) {}
    

    ngOnInit() {
        this.contactsService.selectedContact = null;
        this.contacts = this.contactsService.contacts;
        this.contactsSub = this.contactsService.contactsUpdates
            .subscribe(
                (contacts: ContactItem[]) => {
                    this.contacts = contacts;
                }
            )
        this.contactsService.getContacts();
    }
}
