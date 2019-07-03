import {Component, OnInit} from '@angular/core';
import {ContactsService} from '../../../core/services';
import {ContactItem} from 'src/app/core/models';
import {ActivatedRoute, Router, Params} from '@angular/router';

@Component({
    selector: 'app-contact-details',
    templateUrl: './contact-details.component.html',
    styleUrls: ['./contact-details.component.scss'],
})
export class ContactDetailsComponent implements OnInit {
    contact: ContactItem;
    fetching = true;

    constructor(private contactsServise: ContactsService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            console.log(params);
            this.contactsServise.getContactDetails(params.id).subscribe(
                (data: ContactItem) => {
                    console.log(data);
                    this.contact = data;
                    this.fetching = false;
                    this.contactsServise.selectedContact = data;
                },
                error => {
                    console.log(error);
                    this.fetching = false;
                },
            );
        });
    }

    onCall() {
        console.log(this.contact._id);
    }
}
