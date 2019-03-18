import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { SttResponse } from '@app/models';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SttService {

  host = environment.url;
  path = '/api/stt/getToken';

  url = this.host + this.path;

  constructor(private http: HttpClient) { }

  getToken(): Observable<SttResponse> {
    return this.http.post<SttResponse>(this.url, null, httpOptions);
  }

}
