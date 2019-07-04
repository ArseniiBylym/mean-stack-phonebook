import {Injectable} from '@angular/core';
import { ContactsService } from '../contacts.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { CreateContactData } from 'src/app/core/models';

@Injectable()
export class ContactCreateService {
    constructor(
        private contactsService: ContactsService,
        private fireStorage: AngularFireStorage,
        ) {}

    fileRef: any = null;

    createContact(contact: CreateContactData) {
        this.contactsService.loading$.next(true);
        if (contact.avatar) {
            this.uploadAvatarToFirebase({image: contact.avatar, contact});
        } else {
            this.uploadToServer(contact);
        }
    }

    uploadAvatarToFirebase(data: {image: any, contact: CreateContactData}) {
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
        this.contactsService.create(contactData);
    }

    formatData(contact: CreateContactData, imageUrl?: string) {
        const contactData = Object.assign({}, contact);
        if (!contactData.email) {
            delete contactData.email;
        }
        if (!contactData.company) {
            delete contactData.company;
        }
        if (!contactData.avatar) {
            delete contactData.avatar;
        }
        if (imageUrl) {
            contactData.avatar = imageUrl;
        }
        return contactData;
    }
}
