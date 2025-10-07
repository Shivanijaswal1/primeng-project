import { Component, OnInit } from '@angular/core';
import { ServiceService,Role } from 'src/app/core/service.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddAssignmentDialogComponent } from './add-assignment-dialog.component';
import { AttendancePageComponent } from '../attendance-page/attendance-page.component';
import { FormComponent } from 'src/app/shared/component/form/form.component';


@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss'],
})
export class TeacherDashboardComponent implements OnInit {
  students: any[] = [];
  notifications: string[] = [];
  taskColumns = [
    { field: 'todo', header: 'To Do' },
    { field: 'inprogress', header: 'In Progress' },
    { field: 'done', header: 'Done' }
  ];
  taskItems: any[] = [];

currentView: 'overview' | 'reports' = 'overview';
showSubmittedStudents = false;
  todaysAttendance = 0;
  pendingAssignments = 0;
  upcomingClasses = 0;
  recentActivities: string[] = [];

  isCollapsed = false;
  isDarkMode = false;
  showNotifications = false;
  showProfileMenu = false;
  ref: DynamicDialogRef | undefined;

  attendanceData: any;
  performanceData: any;
    showStudentTable = false;


  menu = [
    { label: 'Overview', icon: 'pi pi-home', route: '/dashboard/overview' },
    { label: 'Students', icon: 'pi pi-users', route: '/dashboard/students' },
    { label: 'Attendance', icon: 'pi pi-calendar', route: '/dashboard/attendance' },
    { label: 'Reports', icon: 'pi pi-chart-bar', route: '/dashboard/reports' }
  ];
  quickActions = [
  { label: 'Take Attendance', icon: '📋', action: () => this.takeAttendance() },
  { label: 'Add Assignment', icon: '➕', action: () => this.addAssignment() },
  { label: 'See the submitted student detail', icon: '📊', action: () => this.toggleSubmittedStudents() },
];
  employees: any;


  constructor(
    private studentService: ServiceService,
    public dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadNotifications();
    this.loadReports();
    this.loadTasks();
    this.studentService.setRole(Role.Teacher);
  }

  loadStudents() {
    this.studentService.getStudent().subscribe(data => {
      this.students = data;
    });
  }

  loadNotifications() {
    this.studentService.getNotifications().subscribe(data => {
      this.notifications = data;
    });
  }

  loadReports() {
    debugger
    this.studentService.getReports().subscribe(data => {
      this.performanceData = {
        labels: data.map(r => r.subject),
        datasets: [
          {
            label: 'Average Score',
            data: data.map(r => r.average),
            backgroundColor: ['#4659b5', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
          }
        ]
      };
    });


    this.attendanceData = {
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
  }
   loadTasks() {
    const savedTasks = localStorage.getItem('taskItems');
    if (savedTasks) {
      this.taskItems = JSON.parse(savedTasks);
    } else {
      this.taskItems = [
        { todo: 'Prepare Math Assignment', inprogress: '', done: '' },
        { todo: '', inprogress: 'Check Science Papers', done: '' },
        { todo: '', inprogress: '', done: 'Submit Attendance Report' }
      ];
    }
  }
  markTaskCompleted(index: number, rowData: any) {
  const updatedTask = { ...rowData, status: '✅ Completed' };
  this.updateTask(index, updatedTask);
}

  updateTask(index: number, updatedTask: any) {
  this.taskItems[index] = updatedTask;
  this.taskItems = [...this.taskItems];
}


  saveTasks() {
    localStorage.setItem('taskItems', JSON.stringify(this.taskItems));
  }

  addTask(newTask: { status: string; description: string; dueDate: string }) {
  this.taskItems.push({
    todo: newTask.description,
    inprogress: '',
    done: '',
    status: newTask.status,
    dueDate: newTask.dueDate
  });

  this.taskItems = [...this.taskItems];
}

  moveTask(index: number, from: keyof typeof this.taskItems[0], to: keyof typeof this.taskItems[0]) {
    const taskText = this.taskItems[index][from];
    if (taskText) {
      this.taskItems[index][from] = '';
      this.taskItems[index][to] = taskText;
      this.saveTasks();
    }
  }

  removeTask(index: number) {
    this.taskItems.splice(index, 1);
    this.saveTasks();
  }
  loadDummyStats() {
    this.todaysAttendance = 95;
    this.pendingAssignments = 8;
    this.upcomingClasses = 3;
  }

  loadDummyActivities() {
    this.recentActivities = [
      '✅ Assignment graded for Class 10A',
      '📅 Parent meeting scheduled for Friday',
      '📋 Attendance submitted for Class 9B',
      '📌 New course material uploaded'
    ];
  }

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
    console.log('Search query:', value);
  }

  goToSettings() {
    console.log('Navigate to settings...');
  }

  logout() {
    console.log('Logout clicked...');
  }
  takeAttendance() {
    debugger
    this.ref = this.dialogService.open(AttendancePageComponent, {
      header: 'Take Attendance',
      width: '600px',
      data: { students: this.students }
    });

    this.ref.onClose.subscribe((attendanceData: any) => {
      if (attendanceData) {
        const presentCount = attendanceData.filter((s: any) => s.present).length;
        this.todaysAttendance = Math.round((presentCount / attendanceData.length) * 100);

        this.studentService.saveAttendance(attendanceData).subscribe(() => {
          console.log('Attendance saved successfully');
        });
      }
    });
  }
addAssignment() {
  debugger
  this.ref = this.dialogService.open(AddAssignmentDialogComponent, {
    width:"700px",
    data: { students: this.students }
  });

  this.ref.onClose.subscribe((assignment: any) => {
    debugger
    if (assignment) {
      this.studentService.addAssignment(assignment).subscribe(() => {
        console.log('Assignment added successfully');

        this.pendingAssignments++;

        this.recentActivities.unshift(`➕ Assignment "${assignment.title}" added for ${assignment.className}`);
        if (this.recentActivities.length > 5) this.recentActivities.pop();

        this.taskItems.push({ todo: assignment.title, inprogress: '', done: '' });

      });
    }
  });
}

updatePerformanceChart() {
  this.studentService.getPerformanceData().subscribe(data => {
    this.performanceData = {
      labels: data.map((r: { subject: any; }) => r.subject),
      datasets: [
        {
          label: 'Average Score',
          data: data.map((r: { average: any; }) => r.average),
          backgroundColor: ['#4659b5', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444']
        }
      ]
    };
  });
}
stateData: Record<string, number> = {
  Karnataka: 70,
  Maharashtra: 85,
  Gujarat: 50,
  Bihar: 30,
  Kerala: 90
};

updateData() {
  this.stateData = {
    ...this.stateData,
    TamilNadu: Math.floor(Math.random() * 100)
  };
}
 show() {
  debugger
    this.ref = this.dialogService.open(FormComponent, {
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
     getEmployeeData() {
    this.studentService.getStudent().subscribe((data) => {
      this.employees = data;
    });
  }

viewReports() {
  this.currentView = 'reports';
}

toggleSubmittedStudents() {
  this.showSubmittedStudents = !this.showSubmittedStudents;
}
}
