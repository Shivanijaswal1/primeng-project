import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Sidebar } from 'primeng/sidebar';
import { ServiceService } from 'src/app/core/service.service';
import { FormComponent } from 'src/app/shared/form/form.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  ref: DynamicDialogRef | undefined;
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  favoritesExpanded = true;
  reportsExpanded = false;

  employees: any[] = [];
meetingDate: any;
selectedDate: Date | null = null;
  constructor(
    private _studnetService: ServiceService,
    private _route: Router,
    public dialogservice: DialogService
  ) {}

  getEmployeeData() {
    this._studnetService.getStudent().subscribe((data) => {
      this.employees = data;
    });
  }
  show() {
    this.ref = this.dialogservice.open(FormComponent, {
      header: 'Student Registration form',
      width: '65%',
      height: 'auto',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      styleClass: 'custom-dialog-header',
    });
    this.ref.onClose.subscribe(() => {
      this.getEmployeeData();
    });
  }

  openChart() {
    this._route.navigateByUrl('dashboard');
  }

  sidebarVisible: boolean = false;

  closeCallback(e: Event): void {
    this.sidebarRef.close(e);
  }

  showCalendar: boolean = false;

  openCalendar() {
    this.showCalendar = true;
  }

  onDateSelect(event: Date) {
    debugger
    console.log("Selected date:", event);
    this.selectedDate = event;
  }
}
