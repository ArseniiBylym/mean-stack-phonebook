import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {ContactItem} from './../models/ContactItem.model';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ContactsService {
    public contacts: ContactItem[] | null = null;
    contactsUpdates = new Subject<ContactItem[]>();

    constructor(private http: HttpClient) {}

    getOptions() {
        return {
            headers: new HttpHeaders({
                Authorization: `Bearer ${localStorage.getItem(`token`)}`,
                'Content-Type': 'application/json',
            })
        }
    }

    getContacts() {
        if (this.contacts) {
            return this.contactsUpdates.next(this.contacts);
        }
        this.http.get(`${environment.BASE_URL}/contacts`, this.getOptions()).subscribe(
            (data: ContactItem[]) => {
                this.contacts = data;
                this.contactsUpdates.next(this.contacts);
            },
            error => {
                console.log(error)
            }
        )
    }

    addContact(contact: ContactItem) {
        this.contacts.push(contact);
        this.contactsUpdates.next(this.contacts);
    } 

    deleteContact(_id: string) {
        this.contacts = this.contacts.filter(item => item._id !== _id);
        this.contactsUpdates.next(this.contacts);
    }

    updateContact(contact: ContactItem) {
        this.contacts = this.contacts.map(item => {
            if (contact._id === item._id) return contact;
            return item;
        })
        this.contactsUpdates.next(this.contacts);
    }
}
