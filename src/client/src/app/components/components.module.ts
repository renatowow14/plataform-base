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
import { MenuModule } from 'primeng/menu';

@NgModule({
  declarations: [ ...routedComponents],
  imports: [
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
    DropdownModule,
    TranslateModule,
    TooltipModule,
    AccordionModule,
    ScrollPanelModule,
    OlMapsModule,
    InputNumberModule,
    ImageModule,
    MenuModule,
    ToastModule
  ]
})
export class ComponentsModule { }
