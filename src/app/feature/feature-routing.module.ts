import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './compoenent/table/table.component';
import { BarChartComponent } from '../shared/bar-chart/bar-chart.component';

const routes: Routes = [
  {path:"",redirectTo:"student-details",pathMatch:"full"},
  {path:"student-details",component:TableComponent},
  {path:"dashboard",component:BarChartComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule { }
