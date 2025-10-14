import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = localStorage.getItem('user');

  if (user) {
    const userObj = JSON.parse(user);
    switch (userObj.role) {
      case 'Student':
        router.navigate(['/student-detail']);
        break;
      case 'Teacher':
        router.navigate(['/teacher-dashboard']);
        break;
      case 'Admin':
        router.navigate(['/admin-dashboard']);
        break;
      case 'Accounts':
        router.navigate(['/accounts-dashboard']);
        break;
    }
    return false;
  }

  return true;
};
