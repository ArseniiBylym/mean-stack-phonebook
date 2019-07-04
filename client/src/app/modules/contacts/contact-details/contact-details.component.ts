import {Component, OnInit} from '@angular/core';
import {ContactsService} from '../contacts.service';
import {ContactItem} from 'src/app/core/models';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
    selector: 'app-contact-details',
    templateUrl: './contact-details.component.html',
    styleUrls: ['./contact-details.component.scss'],
})
export class ContactDetailsComponent implements OnInit {
    constructor(
        private contactsServise: ContactsService,
        private route: ActivatedRoute,
    ) {}

    contact: ContactItem;
    fetching = true;


    ngOnInit() {
        this.contactsServise.selectedContact$
            .subscribe(
                contact => {
                    this.contact = contact;
                }
            );
        this.contactsServise.loading$
            .subscribe(
                loading => {
                    this.fetching = loading;
                }
            );
        this.route.params.subscribe((params: Params) => {
            console.log(params);
            this.contactsServise.getDetails(params.id);
        });
    }

    onCall() {
        console.log(this.contact._id);
    }
}
