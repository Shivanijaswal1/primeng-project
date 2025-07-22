import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './compoenent/table/table.component';
import { BarChartComponent } from '../shared/component/bar-chart/bar-chart.component';
import { StudentFeeDetailComponent } from './student-fee-detail/student-fee-detail.component';

const routes: Routes = [
  // {path:'',redirectTo:"student-details",pathMatch:"full"},
  {path:'',component:TableComponent},
  {path:"dashboard",component:BarChartComponent},
  {path:'student-fee',component:StudentFeeDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule { }
