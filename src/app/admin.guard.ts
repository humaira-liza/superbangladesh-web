import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {

  const router = inject(Router);

  const role = (localStorage.getItem('role') || '').toLowerCase();

  console.log("ADMIN GUARD ROLE:", role);

  if (role === 'admin') {
    return true;
  }

  alert('Admin only 🔒');
  router.navigate(['/']);
  return false;
};