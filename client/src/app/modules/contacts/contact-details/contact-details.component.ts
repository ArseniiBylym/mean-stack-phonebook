import {Component, OnInit} from '@angular/core';
import {ContactsService} from './../../../services/contacts.service';
import {ContactItem} from 'src/app/models/ContactItem.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
    selector: 'app-contact-details',
    templateUrl: './contact-details.component.html',
    styleUrls: ['./contact-details.component.scss'],
})
export class ContactDetailsComponent implements OnInit {
    contact: ContactItem;
    fetching: boolean = true;

    constructor(
        private contactsServise: ContactsService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.route.params   
            .subscribe(
                (params: Params) => {
                    console.log(params)
                    this.contactsServise.getContactDetails(params.id)
                        .subscribe(
                            (data: ContactItem) => {
                                console.log(data)
                                this.contact = data;
                                this.fetching = false;
                                this.contactsServise.selectedContact = data;
                            },
                            error => {
                                console.log(error);
                                this.fetching = false;
                            }
                        );
                }
            )
    }

    onCall() {
        console.log(this.contact._id)
    }
}
