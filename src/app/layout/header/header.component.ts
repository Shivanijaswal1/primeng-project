import { Component, EventEmitter, NgZone, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Sidebar } from 'primeng/sidebar';
import { ServiceService } from 'src/app/core/service.service';
import { FormComponent } from 'src/app/shared/component/form/form.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  ref: DynamicDialogRef | undefined;

  sidebarVisible = false;
  toolbarTitle = 'Students Details';
  sidebarStyle = {
    'background': 'linear-gradient(135deg, #4660b5 0%, #6a82fb 100%)',
    'box-shadow': '0 4px 24px rgba(70,89,181,0.15)',
    'border-radius': '18px 0 0 18px',
    'width': '320px',
    'color': '#fff'
  };

  @Output() addStudent = new EventEmitter<void>();
  @Output() dashboard = new EventEmitter<void>();
  email: any;
  employees: any[]=[];

  constructor(public studentService: ServiceService,
     private _route: Router,
    public dialogservice: DialogService,
    private zone: NgZone,
  ) {}

    role: string = '';  // currently selected role
  roleItems: MenuItem[] = [
    { label: 'Teacher', command: () => this.selectRole('Teacher') },
    { label: 'Admin', command: () => this.selectRole('Admin') },
    { label: 'Accounts', command: () => this.selectRole('Accounts') },
    { label: 'Student', command: () => this.selectRole('Student') }
  ];

  selectRole(selectedRole: string) {
    this.role = selectedRole;
    console.log('Role selected:', selectedRole);
  }
     getEmployeeData() {
    this.studentService.getStudent().subscribe((data) => {
      this.employees = data;
    });
  }
  onAddStudent() {
    this.addStudent.emit();
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

  onDashboard() {
    this.dashboard.emit();
  }

    loginDemo() {
    if (!this.role) {
      alert('Please select a role first!');
      return;
    }

    const user = { email: this.email, role: this.role, name: this.role };
    localStorage.setItem('user', JSON.stringify(user));
    console.log('User stored in localStorage:', user);

    this.navigateByRole(this.role);
  }
    private navigateByRole(role: string) {
    switch (role) {
      case 'Teacher':
        this.zone.run(() => this._route.navigate(['/teacher-dashboard']));
        break;
      case 'Admin':
        this.zone.run(() => this._route.navigate(['/admin-dashboard']));
        break;
      case 'Accounts':
        this.zone.run(() => this._route.navigate(['/accounts-dashboard']));
        break;
      default:
        this.zone.run(() => this._route.navigate(['/student-detail']));
    }
  }
}
