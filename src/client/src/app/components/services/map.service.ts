import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private apiURL = '/service/map';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) { }

  getDescriptor(lng): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + '/descriptor?lang=' + lng)
      .pipe(
        catchError(this.errorHandler),
      );
  }

  extent(region): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + '/extent?region=' + region)
      .pipe(
        catchError(this.errorHandler),
      );
  }

  search(key): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + '/search?format=json&textRegion=' + key)
      .pipe(
        catchError(this.errorHandler),
      );
  }

  downloadSHP(parameters): Observable<Blob> {
    return this.httpClient.post(this.apiURL + "/download/shp", parameters, { responseType: 'blob' })
  }

  downloadCSV(parameters): Observable<Blob> {
    return this.httpClient.post(this.apiURL + "/download/csv", parameters, { responseType: 'blob' })
  }


  errorHandler(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
