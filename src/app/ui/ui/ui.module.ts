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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabMenuModule } from 'primeng/tabmenu';
import { SidebarModule } from 'primeng/sidebar';
import { Sidebar } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { PasswordModule } from 'primeng/password';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';


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
  MultiSelectModule,
  ProgressSpinnerModule,
  RadioButtonModule,
  FileUploadModule,
  SelectButtonModule,
  TabMenuModule,
  SidebarModule,
  AvatarModule,
  StyleClassModule,
  DialogModule,
  PasswordModule,
  ReactiveFormsModule,
  RippleModule
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    primengModule,
    ConfirmDialogModule,
    MultiSelectModule,
    FormsModule,
    TableModule,
    SelectButtonModule,
    SidebarModule,
  ],
  exports: [
    primengModule,
    ConfirmDialogModule,
    SelectButtonModule,
    SidebarModule,
    Sidebar,
    AvatarModule,
    StyleClassModule,
    DialogModule,
    PasswordModule,
    ReactiveFormsModule,
    RadioButtonModule
  ],
})
export class UiModule {}
