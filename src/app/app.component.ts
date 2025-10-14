import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'form';
  constructor(private router:Router){}
  ngOnInit() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const lastRole = localStorage.getItem('lastRole');

  if (user && user.role) {
    if (user.role === 'teacher') {
      this.router.navigate(['teacher-dashboard']);
    } else {
      this.router.navigate(['student-detail']);
    }
  } else if (lastRole) {
    if (lastRole === 'teacher') {
      this.router.navigate(['teacher-dashboard']);
    } else {
      this.router.navigate(['student-detail']);
    }
  }
}

}
