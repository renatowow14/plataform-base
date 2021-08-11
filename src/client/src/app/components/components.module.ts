import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ComponentsRoutingModule, routedComponents } from './components-routing.module';
import { DragScrollModule } from 'ngx-drag-scroll';
@NgModule({
  declarations: [ ...routedComponents],
  imports: [
    CommonModule,
    SidebarModule,
    DragScrollModule,
    ComponentsRoutingModule,
    ButtonModule
  ]
})
export class ComponentsModule { }
