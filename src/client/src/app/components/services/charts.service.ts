import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  lulc(parameters): Observable<any> {
    return this.httpClient.post(this.apiURL + "/lulc", parameters)
      .pipe(
        catchError(this.errorHandler),
      );   
  }

  deforestation(parameters): Observable<any> {
    return this.httpClient.post(this.apiURL + "/deforestation", parameters)
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
