import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  private apiURL = '/service/download';

  constructor(private httpClient: HttpClient) { }

  downloadSHP(parameters): Observable<Blob> {
    console.log(parameters)
    return this.httpClient.post(this.apiURL + "/shp", parameters, { responseType: 'blob' })
  }

  downloadCSV(parameters): Observable<Blob> {
    return this.httpClient.post(this.apiURL + "/csv", parameters, { responseType: 'blob' })
  }
}
