import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from "./main/main.component";
import { LeftSideBarComponent } from "./left-side-bar/left-side-bar.component";
import { GeneralMapComponent } from "./general-map/general-map.component";

const routes: Routes = [{
  path: '',
  component: MainComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }

export const routedComponents = [
  LeftSideBarComponent,
  GeneralMapComponent,
  MainComponent
];

