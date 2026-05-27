import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {

  email = '';
  password = '';

  loading = false;
  showPassword = false;

  // ✅ API URL
  apiUrl =
    'https://superbangladesh-api-1.onrender.com';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  togglePassword() {

    this.showPassword =
      !this.showPassword;
  }

  submit() {

    if (!this.email || !this.password) {

      alert('Enter email & password');

      return;
    }

    this.loading = true;

    this.http.post<any>(

      `${this.apiUrl}/api/auth/login`,

      {
        email: this.email,
        password: this.password
      }

    ).subscribe({

      next: (res) => {

        console.log('LOGIN RESPONSE', res);

        this.loading = false;

        // ✅ SAFE CHECK
        if (!res) {

          alert('No response from server');

          return;
        }

        if (res?.error) {

          alert(res.error);

          return;
        }

        if (res?.token) {

          localStorage.setItem(
            'token',
            res.token
          );
        }

        if (res?.role) {

          localStorage.setItem(
            'role',
            res.role
          );
        }

        if (res?.email) {

          localStorage.setItem(
            'email',
            res.email
          );
        }

        // ✅ REDIRECT
        if (res?.role === 'ADMIN') {

          this.router.navigate([
            '/admin/orders'
          ]);

        } else {

          this.router.navigate(['/']);
        }
      },

      error: (err) => {

        console.log('LOGIN ERROR', err);

        this.loading = false;

        alert(

          err?.error?.message ||

          err?.message ||

          'Login failed ❌'
        );
      }
    });
  }
}