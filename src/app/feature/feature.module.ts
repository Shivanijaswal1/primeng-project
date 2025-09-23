import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureRoutingModule } from './feature-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UiModule } from '../ui/ui/ui.module';
import { TableComponent } from './compoenent/table/table.component';
import { LayoutModule } from '../layout/layout.module';
import { HighlightPipe } from './pipe/highlight.pipe';
import { StudentFeeDetailComponent } from './student-fee-detail/student-fee-detail.component';
import { ChartModule } from 'primeng/chart';
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { TeacherDashboardComponent } from './compoenent/teacher-dashboard/teacher-dashboard.component';
import { AddAssignmentDialogComponent } from './compoenent/teacher-dashboard/add-assignment-dialog.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
@NgModule({
  declarations: [TableComponent, HighlightPipe, StudentFeeDetailComponent, TeacherDashboardComponent, AddAssignmentDialogComponent],
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
