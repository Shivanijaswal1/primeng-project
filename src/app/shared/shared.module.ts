import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZButtonComponent } from './z-button/z-button.component';
import { UiModule } from '../ui/ui/ui.module';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputComponent } from './input/input.component';
import { FormComponent } from './form/form.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { TabsComponent } from './tabs/tabs.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { StudentDetailFormComponent } from './tabs/component/student-detail-form/student-detail-form.component';
import { StudentDetailTableComponent } from './tabs/component/student-detail-table/student-detail-table.component';
import { ConfigurationBasedFormComponent } from './tabs/component/configuration-based-form/configuration-based-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowDataComponent } from './show-data/show-data.component';
import { AdvanceSortingComponent } from './advance-sorting/advance-sorting.component';
import { FileUpload } from 'primeng/fileupload';
import { SubmitMessageComponent } from './submit-message/submit-message.component';
import { HighlightPipe } from 'src/app/feature/pipe/highlight.pipe';
import { DialogMessageComponent } from './tabs/component/dialog-message/dialog-message.component';



@NgModule({
  declarations: [
    ZButtonComponent,
    InputComponent,
    FormComponent,
    DropdownComponent,
    CheckboxComponent,
    BarChartComponent,
    PieChartComponent,
    TabsComponent,
    StudentDetailFormComponent,
    StudentDetailTableComponent,
    ConfigurationBasedFormComponent,
    ShowDataComponent,
    AdvanceSortingComponent,
    SubmitMessageComponent,
    DialogMessageComponent,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    UiModule,
    FormsModule,
    InputTextModule,
    MultiSelectModule,
    ReactiveFormsModule,
  
],

  exports: [
    ZButtonComponent,
    CheckboxComponent,
    BarChartComponent,
    PieChartComponent,
    TabsComponent,
    ShowDataComponent,
    AdvanceSortingComponent,
    FileUpload,
    ConfigurationBasedFormComponent,

  ],
  providers:[HighlightPipe]
})
export class SharedModule {}
