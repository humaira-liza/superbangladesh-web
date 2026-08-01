import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
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
    private router: Router,
    public languageService: LanguageService
  ) {}

  t(key: string): string {
    return this.languageService.translate(key);
  }

  register() {

    if (
      !this.fullName ||
      !this.email ||
      !this.phone ||
      !this.password
    ) {

      alert(this.t('fillAllRequiredFields'));

      return;
    }

    if (this.password !== this.confirmPassword) {

      alert(this.t('passwordDoesNotMatch'));

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

        alert(this.t('registrationSuccessful'));

        this.router.navigate(['/login']);

      },

      error: (err) => {

        this.loading = false;

        console.log(err);

        alert(this.t('registrationFailed'));

      }

    });

  }

}
