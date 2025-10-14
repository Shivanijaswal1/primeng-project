import { NgModule } from '@angular/core';
import { CommonModule  } from '@angular/common';
import { FeatureRoutingModule } from './feature-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UiModule } from '../ui/ui/ui.module';
import { TableComponent } from './compoenent/Student-dashboard/Student-dashboard.component';
import { LayoutModule } from '../layout/layout.module';
import { HighlightPipe } from '../shared/pipe/highlight.pipe';
import { StudentFeeDetailComponent } from './compoenent/student-fee-detail/student-fee-detail.component';
import { ChartModule } from 'primeng/chart';
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { TeacherDashboardComponent } from './compoenent/teacher-dashboard/teacher-dashboard.component';
import { AddAssignmentDialogComponent } from './compoenent/add-assignment-dialog/add-assignment-dialog.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { AttendancePageComponent } from './compoenent/attendance-page/attendance-page.component';
@NgModule({
  declarations: [TableComponent, HighlightPipe, StudentFeeDetailComponent, TeacherDashboardComponent, AddAssignmentDialogComponent,AttendancePageComponent],
  imports: [
    CommonModule,
    FeatureRoutingModule,
    SharedModule,
    UiModule,
    LayoutModule,
    ChartModule,
    StepsModule,
    ButtonModule,
    FormsModule,
    MultiSelectModule
  ],

  exports: [SharedModule],
})
export class FeatureModule {}
