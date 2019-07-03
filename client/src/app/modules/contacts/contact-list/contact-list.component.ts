import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {ContactsService} from '../../../core/services';
import {ContactItem} from '../../../core/models';

@Component({
    selector: 'app-contact-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
    contacts: ContactItem[];
    filteredContacts: ContactItem[];
    contactsSub: Subscription;
    searchString = '';

    constructor(private contactsService: ContactsService) {}

    searchFilter(list: ContactItem[]) {
        if (!this.searchString) {
            return list;
        }
        return list.filter(item => {
            const nameFound = item.name.toLowerCase().indexOf(this.searchString.toLocaleLowerCase()) > -1;
            return nameFound;
        });
    }

    onSearchChange() {
        if (!this.contacts) {
            return;
        }
        this.filteredContacts = this.searchFilter(this.contacts);
    }

    ngOnInit() {
        this.contactsService.selectedContact = null;
        this.contacts = this.contactsService.contacts;
        this.filteredContacts = this.contactsService.contacts;
        this.contactsSub = this.contactsService.contactsUpdates.subscribe((contacts: ContactItem[]) => {
            this.contacts = contacts;
            this.filteredContacts = this.searchFilter(contacts);
        });
        this.contactsService.getContacts();
    }
}
