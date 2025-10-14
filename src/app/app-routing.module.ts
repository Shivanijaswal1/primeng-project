import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/Component/login.component';
import { loginGuard } from './core/guard/login.guard';
import { authGuard } from './core/guard/auth-guard.guard';
import { NotFoundComponent } from './shared/component/not-found/not-found.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent, canActivate: [loginGuard] },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () =>
      import('./feature/feature.module').then((m) => m.FeatureModule),
    canActivate: [authGuard],
  },

  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
