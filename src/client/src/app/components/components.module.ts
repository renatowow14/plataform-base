import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {InputSwitchModule} from 'primeng/inputswitch';
import {FormsModule} from '@angular/forms';
import {CardModule} from 'primeng/card';
import { ComponentsRoutingModule, routedComponents } from './components-routing.module';
import { DragScrollModule } from 'ngx-drag-scroll';
@NgModule({
  declarations: [ ...routedComponents],
  imports: [
    CommonModule,
    SidebarModule,
    TabMenuModule,
    TabViewModule,
    FormsModule,
    InputSwitchModule,
    CardModule,
    DragScrollModule,
    ComponentsRoutingModule,
    ButtonModule
  ]
})
export class ComponentsModule { }
