import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { ComponentsRoutingModule, routedComponents } from './components-routing.module';
import { DragScrollModule } from 'ngx-drag-scroll';
import { TranslateModule } from "@ngx-translate/core";
import { TooltipModule } from 'primeng/tooltip';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { OlMapsModule } from "../@core/ol-maps/ol-maps.module";
import { InputNumberModule } from 'primeng/inputnumber';
import { ImageModule } from 'primeng/image';
import { ToastModule } from 'primeng/toast';
import { ChartModule } from 'primeng/chart';
//import { ChartsComponent } from './right-side-bar/charts/charts.component';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'primeng/fileupload';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AreaComponent } from './left-side-bar/area/area.component';
import { LOCALE_ID } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData, DatePipe, DecimalPipe } from '@angular/common';

registerLocaleData(localePt);


@NgModule({
  declarations: [...routedComponents, AreaComponent],
  imports: [
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatProgressBarModule,
    FileUploadModule,
    CommonModule,
    SidebarModule,
    TabMenuModule,
    TabViewModule,
    FormsModule,
    InputSwitchModule,
    InputTextModule,
    AutoCompleteModule,
    CardModule,
    DragScrollModule,
    ComponentsRoutingModule,
    ButtonModule,
    ChartModule,
    DropdownModule,
    TranslateModule,
    TooltipModule,
    AccordionModule,
    ScrollPanelModule,
    OlMapsModule,
    InputNumberModule,
    ImageModule,
    MenuModule,
    ToastModule,
    DialogModule,
    DragDropModule,
    HttpClientModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    DatePipe,
    DecimalPipe
  ]
})
export class ComponentsModule { }
