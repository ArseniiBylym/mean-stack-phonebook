import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire';
import {AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';
import {HttpClientModule} from '@angular/common/http';

import { ContactsComponent } from './contacts.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ContactCreateComponent } from './contact-create/contact-create.component';
import { ContactEditComponent } from './contact-edit/contact-edit.component';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactCreateService } from './../../services/contact-create.service';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    ContactsComponent,
    ContactListComponent, 
    ContactDetailsComponent, 
    ContactCreateComponent, 
    ContactEditComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    ContactsRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
  ],
  providers: [
    { provide: StorageBucket, useValue: 'ng-phonebook-58f04.appspot.com' },
    ContactCreateService,
  ],
})
export class ContactsModule { }
