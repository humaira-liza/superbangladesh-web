import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login() {
    localStorage.setItem('login', 'true');
  }

  logout() {
    localStorage.removeItem('login');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('login') === 'true';
  }
}            