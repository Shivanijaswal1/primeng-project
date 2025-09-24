import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/core/service.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddAssignmentDialogComponent } from './add-assignment-dialog.component';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss'],
})
export class TeacherDashboardComponent implements OnInit {
  students: any[] = [];
  ref: DynamicDialogRef | undefined;

  constructor(private studentService: ServiceService, public dialogService: DialogService) {}

  ngOnInit() {
    this.studentService.getStudent().subscribe(data => {
      this.students = data;
    });
  }

  menu =[
  { label: 'Overview', icon: 'pi pi-home', route: '/dashboard/overview' },
  { label: 'Students', icon: 'pi pi-users', route: '/dashboard/students' },
  { label: 'Attendance', icon: 'pi pi-calendar', route: '/dashboard/attendance' },
  { label: 'Reports', icon: 'pi pi-chart-bar', route: '/dashboard/reports' }
];
  isCollapsed = false;
  isDarkMode = false;
  showNotifications = false;
  showProfileMenu = false;
  notifications = ["New assignment uploaded", "Meeting at 2 PM", "3 students absent"];

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  toggleProfile() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  onSearch(event: any) {
    const value = event.target.value;
    console.log("Search query:", value);
  }

  goToSettings() {
    console.log("Navigate to settings...");
  }

  logout() {
    console.log("Logout clicked...");
  }

  takeAttendance() {
    console.log("Open attendance module...");
  }

  addAssignment() {
    this.ref = this.dialogService.open(AddAssignmentDialogComponent, {
      header: 'Add Assignment',
      width: '400px',
      data: { students: this.students }
    });
    this.ref.onClose.subscribe((assignment: any) => {
      if (assignment) {
        // handle the new assignment (e.g., save to service or backend)
        // Example: this.studentService.addAssignment(assignment);
      }
    });
  }

  viewReports() {
    console.log("Navigate to reports...");
  }
  attendanceData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'Attendance %',
      data: [92, 95, 97, 90, 94],
      fill: false,
      borderColor: '#4659b5',
      tension: 0.3
    }
  ]
};

performanceData = {
  labels: ['Math', 'Science', 'English', 'History', 'Sports'],
  datasets: [
    {
      label: 'Average Score',
      data: [80, 85, 78, 90, 88],
      backgroundColor: ['#4659b5', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
    }
  ]
};
taskColumns = [
  { field: 'todo', header: 'To Do' },
  { field: 'inprogress', header: 'In Progress' },
  { field: 'done', header: 'Done' }
];

taskItems = [
  { id: 1, title: 'Prepare Math Assignment', status: 'todo' },
  { id: 2, title: 'Check Science Papers', status: 'inprogress' },
  { id: 3, title: 'Submit Attendance Report', status: 'done' },
  { id: 4, title: 'Plan Parent Meeting', status: 'todo' },
  { id: 5, title: 'Upload Study Material', status: 'inprogress' }
];

}
