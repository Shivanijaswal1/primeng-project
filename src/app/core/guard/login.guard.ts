import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = localStorage.getItem('user');
  const role = (localStorage.getItem('selectedRole') || '').toLowerCase();
  if (user) {

  if (role === 'teacher') router.navigate(['/teacher-dashboard'], { replaceUrl: true });
    else router.navigate(['/student-detail'], { replaceUrl: true });
    return false;
    }
     return true;
  }

