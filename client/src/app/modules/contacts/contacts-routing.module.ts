import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ContactsComponent} from './contacts.component';
import {ContactListComponent} from './contact-list/contact-list.component';
import {ContactDetailsComponent} from './contact-details/contact-details.component';
import {ContactCreateComponent} from './contact-create/contact-create.component';
import {ContactEditComponent} from './contact-edit/contact-edit.component';

const contactsRoutes: Routes = [
    {
        path: '',
        component: ContactsComponent,
        children: [
            {path: '', component: ContactListComponent},
            {path: 'new', component: ContactCreateComponent},
            {path: ':id', component: ContactDetailsComponent},
            {path: ':id/edit', component: ContactEditComponent},
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(contactsRoutes)],
    exports: [RouterModule],
})
export class ContactsRoutingModule {}
