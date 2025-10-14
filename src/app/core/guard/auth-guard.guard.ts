import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = localStorage.getItem('user');
  const selectedRole = (
    localStorage.getItem('selectedRole') || ''
  ).toLowerCase();

  if (!user) {
    router.navigate(['/auth'], { replaceUrl: true });
    return false;
  }

  const url = state.url.toLowerCase();

  if (url.includes('teacher-dashboard') && selectedRole !== 'teacher') {
    router.navigate(['/student-detail'], { replaceUrl: true });
    return false;
  }

  if (url.includes('student-detail') && selectedRole !== 'student') {
    router.navigate(['/teacher-dashboard'], { replaceUrl: true });
    return false;
  }

  return true;
};
