import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotsiteComponent } from './hotsite.component';
const routes: Routes =  [{
  path: '',
  component: HotsiteComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotsiteRoutingModule { }
