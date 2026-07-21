import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {
  AppLanguage,
  LanguageService
} from '../../services/language.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account implements OnInit {

  constructor(
  private router: Router,
  private http: HttpClient,
  public languageService: LanguageService
) {}

  get selectedLanguage(): AppLanguage {
    return this.languageService.language();
  }

  changeLanguage(language: AppLanguage): void {
    this.languageService.setLanguage(language);
  }

  fullName = '';
phone = '';
email = '';
address = '';
ngOnInit(): void {
  this.loadProfile();
}

loadProfile(): void {

  const token = localStorage.getItem('token');

  if (!token) {
    return;
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  this.http.get<any>(
    'http://localhost:8080/api/users/profile',
    { headers }
  ).subscribe({

  next: (user) => {

  console.log('Profile API Response:', user);

  this.fullName = user.fullName || '';
  this.phone = user.phone || '';
  this.email = user.email || '';
  this.address = user.address || '';

},

    error: (err) => {
      console.error(err);
    }

  });

}

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');

    this.router.navigate(['/login']);
  }

}