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
  @Output() bookmarkClicked = new EventEmitter<void>();
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  favoritesExpanded: boolean = true;
  reportsExpanded: boolean = false;
  employees: any[] = [];
  meetingDate: any;
  selectedDate: Date | null = null;
  email: any;
  role: any;
  // email: string = 'demo@example.com'; // just for example
  roleItems: MenuItem[];

  constructor(
    private _studnetService: ServiceService,
    private _route: Router,
    public dialogservice: DialogService,
    private zone: NgZone,
  ) {


    this.roleItems = [
      { label: 'Teacher', command: () => this.switchRole('Teacher') },
      { label: 'Admin', command: () => this.switchRole('Admin') },
      { label: 'Accounts', command: () => this.switchRole('Accounts') },
      { label: 'Student', command: () => this.switchRole('Student') }
    ];
  }
 availableRoles = [
    { name: 'Teacher', icon: 'pi pi-graduation-cap' },
    { name: 'Admin', icon: 'pi pi-cog' },
    { name: 'Accounts', icon: 'pi pi-calculator' },
    { name: 'Student', icon: 'pi pi-book' }
  ];

  onBookmarkClick() {
    localStorage.setItem('showFeeChart', 'true');
    this._route.navigateByUrl('student-fee');
  }

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
    this._route.navigateByUrl('student-details');
  }

  openCharts() {
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
    this.selectedDate = event;
  }
//    private navigateByRole(role: string) {
//     switch (role) {
//       case 'Teacher':
//         this.zone.run(() => this._route.navigate(['/teacher-dashboard']));
//         break;
//       case 'Admin':
//         this.zone.run(() => this._route.navigate(['/admin-dashboard']));
//         break;
//       case 'Accounts':
//         this.zone.run(() => this._route.navigate(['/accounts-dashboard']));
//         break;
//       default:
//         this.zone.run(() => this._route.navigate(['/student-detail']));
//     }
//   }
//     loginDemo() {
//   const user = { email: this.email, role: this.role, name: this.role };
//   localStorage.setItem('user', JSON.stringify(user));
//   this.navigateByRole(this.role);
// }



  switchRole(role: string) {
    this.role = role;
    console.log('Role switched to:', this.role);
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
}
