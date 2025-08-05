import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent{

  @Output() closeSidebar = new EventEmitter<void>();
  selectedDate: Date | null = null;
  showCalendar: boolean = false;

  menuItems = [
    {
      title: 'Dashboard',
      icon: 'pi pi-home',
      route: '/student-detail',
      active: true
    },
    {
      title: 'Student Management',
      icon: 'pi pi-users',
      route: '/student-detail',
      subItems: [
        { title: 'All Students', icon: 'pi pi-list', route: '/student-detail' },
        { title: 'Add Student', icon: 'pi pi-plus', route: '/student-detail' },
        { title: 'Student Details', icon: 'pi pi-user', route: '/student-detail' }
      ]
    },
    {
      title: 'Fee Management',
      icon: 'pi pi-credit-card',
      route: '/student-fee',
      subItems: [
        { title: 'Fee Collection', icon: 'pi pi-money-bill', route: '/student-fee' },
        { title: 'Fee Reports', icon: 'pi pi-chart-bar', route: '/student-fee' },
        { title: 'Payment History', icon: 'pi pi-history', route: '/student-fee' }
      ]
    },
    {
      title: 'Reports',
      icon: 'pi pi-chart-line',
      route: '/dashboard',
      subItems: [
        { title: 'Analytics', icon: 'pi pi-chart-pie', route: '/dashboard' },
        { title: 'Performance', icon: 'pi pi-chart-bar', route: '/dashboard' },
        { title: 'Statistics', icon: 'pi pi-chart-line', route: '/dashboard' }
      ]
    },
    {
      title: 'Calendar',
      icon: 'pi pi-calendar',
      route: '/calendar',

    },
    {
      title: 'Settings',
      icon: 'pi pi-cog',
      route: '/settings',
      subItems: [
        { title: 'General', icon: 'pi pi-cog', route: '/settings' },
        { title: 'Security', icon: 'pi pi-shield', route: '/settings' },
        { title: 'Notifications', icon: 'pi pi-bell', route: '/settings' }
      ]
    }
  ];

  expandedItems: { [key: string]: boolean } = {};

  constructor(private router: Router) {}

  toggleSubmenu(itemTitle: string): void {
    this.expandedItems[itemTitle] = !this.expandedItems[itemTitle];
  }

  isExpanded(itemTitle: string): boolean {
    return this.expandedItems[itemTitle] || false;
  }

  navigateToRoute(route: string): void {
    this.router.navigate([route]);
    this.closeSidebar.emit();
  }

  onCloseSidebar(): void {
    this.closeSidebar.emit();
  }
   openCalendar() {
    this.showCalendar = true;
  }
} 