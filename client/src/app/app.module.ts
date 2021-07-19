import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MainComponent } from './components/main/main.component';
import { LeftSideBarComponent } from './components/left-side-bar/left-side-bar.component';
import { GeneralMapComponent } from './components/general-map/general-map.component';
import { RightSideBarComponent } from './components/right-side-bar/right-side-bar.component';
import { HotsiteComponent } from './hotsite/hotsite.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LeftSideBarComponent,
    GeneralMapComponent,
    RightSideBarComponent,
    HotsiteComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
