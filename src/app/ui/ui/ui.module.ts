import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { SplitterModule } from 'primeng/splitter';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { CalendarModule } from 'primeng/calendar';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TabViewModule } from 'primeng/tabview';
import { MultiSelectModule } from 'primeng/multiselect';




const primengModule = [
  ButtonModule,
  ToolbarModule,
  TooltipModule,
  TableModule,
  FormsModule,
  SplitterModule,
  InputTextModule,
  DropdownModule,
  CheckboxModule,
  ConfirmDialogModule,
  ToastModule,
  CalendarModule,
  MenuModule,
  OverlayPanelModule,
  TabViewModule,
  MultiSelectModule

];
@NgModule({
  declarations: [],
  imports: [CommonModule, primengModule, ConfirmDialogModule,MultiSelectModule,FormsModule,TableModule],
  exports: [primengModule, ConfirmDialogModule],
})
export class UiModule {}
