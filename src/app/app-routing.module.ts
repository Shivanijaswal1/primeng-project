import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { authGuardGuard } from './auth/guard/auth-guard.guard';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '', component: AuthComponent },
  {
    path: 'student-detail',
    loadChildren: () =>
      import('./feature/feature.module').then((m) => m.FeatureModule),
      canActivate: [authGuardGuard],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
