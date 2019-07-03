import {Injectable} from '@angular/core';
import { ContactsService } from '../contacts.service';
import { ContactItem, CreateContactData } from 'src/app/core/models';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable()
export class ContactEditService {
    constructor(
        private contactsService: ContactsService,
        private fireStorage: AngularFireStorage,
    ) {}

    fileRef: any = null;

    updateContact(data: {image?: File, contact: CreateContactData}) {
        this.contactsService.loading$.next(true);
        if (data.image) {
            this.uploadAvatarToFirebase({image: data.image, contact: data.contact});
        } else {
            this.uploadToServer(data.contact);
        }
    }

    uploadAvatarToFirebase(data: {image: File, contact: CreateContactData}) {
        const phone = data.contact.phone;
        const name = data.contact.name;
        const filePath = `/avatars/${name}_${phone}`;
        this.fileRef = this.fireStorage.ref(filePath);
        this.fileRef
            .put(data.image)
            .then(snapshot => {
                return snapshot.ref.getDownloadURL();
            })
            .then(imageUrl => {
                this.uploadToServer(data.contact, imageUrl);
            });
    }

    uploadToServer(contact: CreateContactData, imageUrl?: string) {
        const contactData = this.formatData(contact, imageUrl);
        this.contactsService.put(contactData);
    }

    formatData(contact: CreateContactData, imageUrl?: string) {
        const contactData = Object.assign({}, contact);
        if (!contactData.email) {
            delete contactData.email;
        }
        if (!contactData.company) {
            delete contactData.company;
        }
        if (imageUrl) {
            contactData.avatar = imageUrl;
        }
        return contactData;
    }
}
