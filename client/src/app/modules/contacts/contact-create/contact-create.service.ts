import {Injectable} from '@angular/core';
import {CreateContactData} from '../../../core/models/CreateContactData.model';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';

@Injectable()
export class ContactCreateService {
    constructor(private http: HttpClient) {}
    setOptions() {
        return {
            headers: new HttpHeaders({
                Authorization: `Bearer ${localStorage.getItem(`token`)}`,
                'Content-Type': 'application/json',
            })
        }
    }

    create(data: CreateContactData) {
        return this.http.post(`${environment.BASE_URL}/contacts`, data, this.setOptions());
    }
}
