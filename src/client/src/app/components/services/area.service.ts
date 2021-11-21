import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AreaService {


  private apiURL = '/service/upload';

  static PARAMS = new HttpParams({
    fromObject: {
      format: "json"
    }
  });

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) { }

  getGeoJsonByToken(params): Observable<any> {

    let parameters = params.join('&')

    return this.httpClient.get<any>(this.apiURL + '/findgeojsonbytoken?' + parameters, this.httpOptions)
      .pipe(map(response => response))
      .pipe(catchError(this.errorHandler));
  }

  saveDrawedGeometry(term: any): Observable<any> {
    console.log("UUUU - ", JSON.stringify(term))
    return this.httpClient.post<any>(
      this.apiURL + '/savegeom',
      JSON.stringify(term),
      this.httpOptions)
      .pipe(
        catchError(this.errorHandler),
      );
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
