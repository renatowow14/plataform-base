import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./hotsite/hotsite.module')
      .then(m => m.HotsiteModule),
  },
  {
    path: '',
    loadChildren: () => import('./components/components.module')
      .then(m => m.ComponentsModule),
  },
  // {
  //   path: '',
  //   redirectTo: '',
  //   pathMatch: 'prefix',
  // },
  {
    path: '**',
    redirectTo: 'map',
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
