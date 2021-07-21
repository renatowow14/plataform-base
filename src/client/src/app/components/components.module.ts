import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ComponentsRoutingModule } from './components-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SidebarModule,
    ComponentsRoutingModule
  ]
})
export class ComponentsModule { }
