import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './compoenent/Student-dashboard/Student-dashboard.component';
import { BarChartComponent } from '../shared/component/bar-chart/bar-chart.component';
import { StudentFeeDetailComponent } from './compoenent/student-fee-detail/student-fee-detail.component';
import { TeacherDashboardComponent } from './compoenent/teacher-dashboard/teacher-dashboard.component';
import { Table } from 'jspdf-autotable';
import { NotFoundComponent } from '../shared/component/not-found/not-found.component';
import { authGuard } from '../core/guard/auth-guard.guard';

const routes: Routes = [
  {path:"dashboard",component:BarChartComponent},
  {path:'student-fee',component:StudentFeeDetailComponent},
  { path: 'teacher-dashboard', component: TeacherDashboardComponent, canActivate: [authGuard] },
  { path: 'student-detail', component:TableComponent, canActivate: [authGuard] },
  {path:'**',component:NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule { }
