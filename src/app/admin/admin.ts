import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LanguageService, AppLanguage } from '../services/language.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin {

  constructor(
    public router: Router,
    public languageService: LanguageService
  ){}

  get isInvoicePage(): boolean{
    return this.router.url.includes('/invoice');
  }

  // ✅ ADMIN PANEL TRANSLATE
  t(key: string): string {
    return this.languageService.translate(key);
  }

  get selectedLanguage(): AppLanguage {
    return this.languageService.getCurrentLanguage();
  }

  changeLanguage(lang: AppLanguage): void {
    this.languageService.setLanguage(lang);
  }

}