import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

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
export class Account {

  constructor(
    private router: Router,
    public languageService: LanguageService
  ) {}

  get selectedLanguage(): AppLanguage {
    return this.languageService.language();
  }

  changeLanguage(language: AppLanguage): void {
    this.languageService.setLanguage(language);
  }

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');

    this.router.navigate(['/login']);
  }

}