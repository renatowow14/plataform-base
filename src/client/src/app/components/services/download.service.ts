import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  private apiURL = '/service/download';

  constructor(private httpClient: HttpClient) { }

  downloadRequest(parameters): Observable<Blob> {
    return this.httpClient.post(this.apiURL, parameters, { responseType: 'blob' })
  }
}
