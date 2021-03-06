import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  //app.get('/service/charts/lulc', dataInjector, charts.chartslulc);
  //app.get('/service/charts/deforestation', dataInjector, charts.deforestation);

  //var language = request.param('lang')
  //var typeRegion = request.param('typeRegion');
  //var textRegion = request.param('textRegion');
  //var region = languageJson["charts_regions"]["biome"][language]

  //  return this.httpClient.post(this.apiURL + "/shp", parameters, { responseType: 'blob' })

  private apiURL = '/service/charts';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) { }

  getDeforestation(parameters): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + '/deforestation?' + parameters, this.httpOptions)
      .pipe(
        catchError(this.errorHandler),
      );
  }

  getLulc(parameters): Observable<any> {

    return this.httpClient.get<any>(this.apiURL + '/lulc?' + parameters, this.httpOptions)
      .pipe(map(response => response))
      .pipe(catchError(this.errorHandler));

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
