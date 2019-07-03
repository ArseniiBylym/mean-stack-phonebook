import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {ContactItem, CreateContactData} from '../../core/models';
import {ApiService} from '../../core/services/api.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';

@Injectable()
export class ContactsService {
    constructor(
        private apiService: ApiService,
        private fireStorage: AngularFireStorage,
        private router: Router,
    ) {}

    private contacts: ContactItem[] | null = null;
    contacts$ = new BehaviorSubject<ContactItem[]>(null);
    loading$ = new BehaviorSubject<boolean>(false);
    selectedContact: ContactItem;
    selectedContact$ = new BehaviorSubject<ContactItem>(null);
    updateErrors$ = new BehaviorSubject<any>(null);
    createErrors$ = new BehaviorSubject<any>(null);

    get() {
        this.loading$.next(true);
        this.apiService.get('/contacts').subscribe(
            (contacts: ContactItem[]) => {
                console.log(contacts);
                this.loading$.next(false);
                this.contacts = contacts;
                this.contacts$.next(this.contacts);
            },
            error => {
                console.log(error);
                this.loading$.next(false);
            },
        );
    }

    create(data: CreateContactData) {
        this.apiService.post('/contacts', data).subscribe(
            (newContact: ContactItem) => {
                this.loading$.next(false);
                this.contacts.push(newContact);
                this.contacts$.next(this.contacts);
                this.router.navigate(['/contacts']);
            },
            error => {
                console.log(error);
                this.loading$.next(false);
                this.createErrors$.next(error);
            },
        );
    }

    put(contactData: CreateContactData) {
        this.apiService.put(`/contacts/${this.selectedContact._id}`, contactData).subscribe(
            (updatedContact: ContactItem) => {
                this.contacts = this.contacts.map(item => {
                    if (item._id === updatedContact._id) {
                        return updatedContact;
                    }
                    return item;
                });
                this.loading$.next(false);
                this.contacts$.next(this.contacts);
                this.selectedContact$.next(updatedContact);
                this.selectedContact = updatedContact;
                this.router.navigate(['/contacts', this.selectedContact._id]);
            },
            error => {
                console.log(error);
                this.loading$.next(false);
                this.updateErrors$.next(error);
            },
        );
    }

    getDetails(id: number | string) {
        this.loading$.next(true);
        this.apiService.get(`/contacts/${id}`).subscribe(
            (contact: ContactItem) => {
                this.loading$.next(false);
                this.selectedContact = contact;
                this.selectedContact$.next(contact);
            },
            error => {
                console.log(error);
                this.loading$.next(false);
            },
        );
    }

    clearDetails() {
        this.selectedContact = null;
        this.selectedContact$.next(null);
    }
}
