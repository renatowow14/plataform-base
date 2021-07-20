import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'map',
    loadChildren: () => import('./components/components.module')
      .then(m => m.ComponentsModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./hotsite/hotsite.module')
      .then(m => m.HotsiteModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'prefix',
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'prefix',
  },
];

const config: ExtraOptions = {
  useHash: false,
};
@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})

export class AppRoutingModule { }