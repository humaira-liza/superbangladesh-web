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
      this.errorMessage = this.t('pleaseSelectAnImage');
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

          alert(this.t('logoChangedSuccessfully'));
        },

        error: () => {

          this.saving = false;
          this.errorMessage = this.t('logoUploadFailedTryAgain');
        }
      });
  }
}
