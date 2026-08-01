import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
  CommonModule,
  FormsModule,
  RouterLink
],
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
    private router: Router,
    public languageService: LanguageService
  ) {}

  /* =========================
     TRANSLATE
  ========================= */

  t(key: string): string {
    return this.languageService.translate(key);
  }

  togglePassword() {

    this.showPassword =
      !this.showPassword;
  }

submit() {

  console.log('SUBMIT CLICKED');


    if (!this.email || !this.password) {

      alert(this.t('enterEmailPassword'));

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

  console.log('LOGIN RESPONSE =', res);

  this.loading = false;

  if (!res) {

    alert(this.t('noResponseFromServer'));

    return;
  }

  // Backend returned an error
  if (res.error) {

    if (res.error === 'User not found') {

      alert(this.t('noAccountFoundRegisterFirst'));

    } else if (res.error === 'Wrong password') {

      alert(this.t('incorrectPassword'));

    } else {

      alert(res.error);

    }

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

            console.log('TOKEN =', localStorage.getItem('token'));
console.log('ROLE =', localStorage.getItem('role'));
console.log('EMAIL =', localStorage.getItem('email'));

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

              this.t('loginFailed')
            );
          }
        });
      },

      error: () => {

        this.loading = false;

        alert(
          this.t('serverWakingUp')
        );
      }
    });
  }
}