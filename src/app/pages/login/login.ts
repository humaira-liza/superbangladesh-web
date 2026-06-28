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

    // 🔥 WAKE BACKEND FIRST
    this.http.get(

      `${this.apiUrl}/api/products`

    ).subscribe({

      next: () => {

        // 🔥 LOGIN REQUEST
        this.http.post<any>(

          `${this.apiUrl}/api/auth/login`,

          {
            email: this.email,
            password: this.password
          }

        ).subscribe({

          next: (res) => {

  alert(JSON.stringify(res));

  console.log('LOGIN RESPONSE', res);

  this.loading = false;

            if (!res) {

              alert(
                'No response from server'
              );

              return;
            }

            // ✅ SAVE TOKEN
            localStorage.setItem(
              'token',
              res.token || ''
            );

            localStorage.setItem(
              'role',
              res.role || ''
            );

            localStorage.setItem(
              'email',
              res.email || ''
            );

            // ✅ REDIRECT
            if (res.role === 'ADMIN') {

              window.location.href =
                '/admin/orders';

            } else {

              window.location.href =
                '/';
            }
          },

          error: (err) => {

            console.log(
              'LOGIN ERROR',
              err
            );

            this.loading = false;

            alert(

              err?.error?.message ||

              err?.message ||

              'Login failed ❌'
            );
          }
        });
      },

      error: () => {

        this.loading = false;

        alert(
          'Server is waking up... try again in 10 seconds ⏳'
        );
      }
    });
  }
}