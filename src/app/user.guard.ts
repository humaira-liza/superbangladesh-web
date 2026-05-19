import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const userGuard: CanActivateFn = () => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  console.log("🔐 GUARD TOKEN:", token);

  // ❌ NO TOKEN
  if (!token) {
    alert('Login required 🔐');
    router.navigate(['/login']);
    return false;
  }

  // ✅ OK
  return true;
};