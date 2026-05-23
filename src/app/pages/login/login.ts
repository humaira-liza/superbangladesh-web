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
  styleUrls: ['./login.scss'] // ✅ make sure file exists
})
export class LoginComponent {

  email = '';
  password = '';

  loading = false;
  showPassword = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  submit() {

    this.loading = true;

    this.http.post<any>(
      'http://superbangladesh-api-1.onrender.com/api/auth/login',
      {
        email: this.email,
        password: this.password
      }
    ).subscribe({

      next: (res) => {

        this.loading = false;

        if (res.error) {
          alert(res.error);
          return;
        }

        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('email', res.email);

        if (res.role === 'ADMIN') {
          this.router.navigate(['/admin/orders']);
        } else {
          this.router.navigate(['/']);
        }
      },

      error: () => {
        this.loading = false;
        alert("Login failed ❌");
      }

    });
  }
}