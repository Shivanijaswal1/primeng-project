import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ServiceService } from 'src/app/core/service.service';
import { FormComponent } from 'src/app/shared/form/form.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  ref: DynamicDialogRef | undefined;
  employees: any[] = [];
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
        header: 'Student form',
        width: '36%',
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
}
