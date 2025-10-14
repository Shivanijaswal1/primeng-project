
import {
  Component,
  EventEmitter,
  NgZone,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Sidebar } from 'primeng/sidebar';
import { ServiceService } from 'src/app/core/service/service.service';

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
    background: 'linear-gradient(135deg, #4660b5 0%, #6a82fb 100%)',
    'box-shadow': '0 4px 24px rgba(70,89,181,0.15)',
    'border-radius': '18px 0 0 18px',
    width: '320px',
    color: '#fff',
  };

  @Output() addStudent = new EventEmitter<void>();
  @Output() dashboard = new EventEmitter<void>();
  email: any;
  employees: any[] = [];
  role: string | null = null;
  constructor(
    public studentService: ServiceService,
    private _route: Router,
    public dialogservice: DialogService,
    private zone: NgZone
  ) {}

  roleItems: MenuItem[] = [
    { label: 'Teacher', command: () => this.selectRole('Teacher') },
    { label: 'Admin', command: () => this.selectRole('Admin') },
    { label: 'Accounts', command: () => this.selectRole('Accounts') },
    { label: 'Student', command: () => this.selectRole('Student') },
  ];
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  selectRole(selectedRole: string) {
    const role = selectedRole.toLowerCase();
    localStorage.setItem('selectedRole', role);

    if (this.isLoggedIn()) {
      localStorage.removeItem('user');

      this._route.navigate(['/auth'], { replaceUrl: true });
    } else {
      this.role = role;
    }
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
    const selectedRole = localStorage.getItem('selectedRole');
    if (!selectedRole) {
      alert('Please select a role!');
      return;
    }
    const user = { email: this.email, role: selectedRole, name: this.email };
    localStorage.setItem('user', JSON.stringify(user));
    this.role = selectedRole;

    this.navigateByRole(selectedRole);

    localStorage.removeItem('selectedRole');
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

  logout() {
    const selectedRole = localStorage.getItem('selectedRole');
    localStorage.clear();

    if (selectedRole) {
      localStorage.setItem('selectedRole', selectedRole);
    }

    this._route.navigate(['auth']);
  }
}
