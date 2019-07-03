import {Injectable} from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';

import { environment } from './../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(
        private http: HttpClient,
    ) {}

    private formatErrors(error: any) {
        if (error.error) {
            return throwError(error.error);
        } else {
            return throwError(error);
        }

    }

    get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
        return this.http.get(`${environment.BASE_URL}${path}`, {params})
            .pipe(catchError(this.formatErrors));
    }

    put(path: string, body: object = {}): Observable<any> {
        return this.http.put(
          `${environment.BASE_URL}${path}`,
          JSON.stringify(body)
        ).pipe(catchError(this.formatErrors));
      }

      post(path: string, body: object = {}): Observable<any> {
        return this.http.post(
          `${environment.BASE_URL}${path}`,
          JSON.stringify(body)
        ).pipe(catchError(this.formatErrors));
      }

      delete(path: string): Observable<any> {
        return this.http.delete(
          `${environment.BASE_URL}${path}`
        ).pipe(catchError(this.formatErrors));
      }
}
