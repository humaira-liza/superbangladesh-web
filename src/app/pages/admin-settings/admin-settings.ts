import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SettingsService, SiteSettings } from '../../services/settings.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings.html',
  styleUrls: ['./admin-settings.css']
})
export class AdminSettings implements OnInit {

  settings: SiteSettings = {};

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  loading = false;
  saving = false;
  errorMessage = '';

  constructor(
    private settingsService: SettingsService,
    public languageService: LanguageService
  ) {}

  t(key: string): string {
    return this.languageService.translate(key);
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {

    this.loading = true;

    this.settingsService.getSettings()
      .subscribe({

        next: (res) => {
          this.settings = res || {};
          this.loading = false;
        },

        error: () => {
          this.loading = false;
        }
      });
  }

  onFileChange(event: any): void {

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  save(): void {

    if (!this.selectedFile) {
      this.errorMessage = 'একটি ছবি নির্বাচন করুন';
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    this.settingsService.uploadLogo(this.selectedFile)
      .subscribe({

        next: (res) => {

          this.settings = res || {};
          this.selectedFile = null;
          this.previewUrl = null;
          this.saving = false;

          alert('লোগো সফলভাবে পরিবর্তন হয়েছে');
        },

        error: () => {

          this.saving = false;
          this.errorMessage = 'লোগো আপলোড ব্যর্থ হয়েছে, আবার চেষ্টা করুন';
        }
      });
  }
}
