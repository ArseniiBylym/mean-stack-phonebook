import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {ContactsService} from '../contacts.service';
import {ContactItem} from '../../../core/models';

@Component({
    selector: 'app-contact-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit, OnDestroy {
    contactsSubscription: Subscription;
    contacts: ContactItem[];

    filteredContacts: ContactItem[];
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
        this.contactsSubscription = this.contactsService.contacts$
            .subscribe(
                (contacts: ContactItem[]) => {
                    this.contacts = this.filteredContacts = contacts;
                }
            );
    }

    ngOnDestroy() {
        this.contactsSubscription.unsubscribe();
    }
}
