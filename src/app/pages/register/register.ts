import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {

  fullName = '';
  email = '';
  phone = '';
  address = '';

  password = '';
  confirmPassword = '';

  loading = false;

  apiUrl =
    'https://superbangladesh-api-1.onrender.com/api/auth/register';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register() {

    if (
      !this.fullName ||
      !this.email ||
      !this.phone ||
      !this.password
    ) {

      alert('Please fill all required fields.');

      return;
    }

    if (this.password !== this.confirmPassword) {

      alert('Password does not match.');

      return;
    }

    this.loading = true;

    this.http.post(
      this.apiUrl,
      {
        fullName: this.fullName,
        email: this.email,
        phone: this.phone,
        address: this.address,
        password: this.password
      }
    ).subscribe({

      next: (res: any) => {

        this.loading = false;

        if (res.error) {

          alert(res.error);

          return;
        }

        alert('Registration successful.');

        this.router.navigate(['/login']);

      },

      error: (err) => {

        this.loading = false;

        console.log(err);

        alert('Registration failed.');

      }

    });

  }

}