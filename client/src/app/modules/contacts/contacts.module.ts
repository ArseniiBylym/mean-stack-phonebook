import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire';
import {AngularFireStorageModule, StorageBucket} from '@angular/fire/storage';
import {HttpClientModule} from '@angular/common/http';

import {ContactsComponent} from './contacts.component';
import {ContactListComponent} from './contact-list/contact-list.component';
import {ContactDetailsComponent} from './contact-details/contact-details.component';
import {ContactCreateComponent} from './contact-create/contact-create.component';
import {ContactEditComponent} from './contact-edit/contact-edit.component';
import {ContactsRoutingModule} from './contacts-routing.module';
import {environment} from 'src/environments/environment';
import { ContactsService } from './contacts.service';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [
        ContactsComponent,
        ContactListComponent,
        ContactDetailsComponent,
        ContactCreateComponent,
        ContactEditComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        ContactsRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireStorageModule,
    ],
    providers: [
        {provide: StorageBucket, useValue: environment.storageBucket},
        ContactsService,
    ],
})
export class ContactsModule {}
