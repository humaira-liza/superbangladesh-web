import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  SettingsService,
  SiteSettings
} from '../../services/settings.service';


@Component({
  selector: 'app-admin-settings',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './admin-settings.html',

  styleUrls: [
    './admin-settings.css'
  ]
})
export class AdminSettings
  implements OnInit {

  loading = true;

  saving = false;

  // লোগোর বর্তমান URL (সার্ভার থেকে আসা)
  logoUrl: string | null = null;

  // নতুন সিলেক্ট করা ফাইল
  selectedFile: File | null = null;

  // নতুন ফাইলের লোকাল প্রিভিউ
  previewUrl: string | null = null;

  errorMessage = '';


  constructor(
    private settingsService: SettingsService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.load();
  }


  load(): void {

    this.loading = true;

    this.settingsService
      .getSettings()
      .subscribe({

        next: (res: SiteSettings) => {

          this.logoUrl =
            res?.logoUrl || null;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: () => {

          // সেটিংস না পেলেও পেজ ভেঙে পড়বে না,
          // শুধু বর্তমান লোগো খালি থাকবে
          this.logoUrl = null;

          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }


  /* =========================
     FILE SELECT
  ========================= */

  onFileSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files && input.files.length
        ? input.files[0]
        : null;

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {

      this.errorMessage =
        'Please select a valid image file';

      return;
    }

    this.errorMessage = '';

    this.selectedFile = file;

    const reader = new FileReader();

    reader.onload = () => {

      this.previewUrl =
        reader.result as string;

      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);
  }


  clearSelection(): void {

    this.selectedFile = null;

    this.previewUrl = null;
  }


  /* =========================
     SAVE / UPLOAD LOGO
  ========================= */

  save(): void {

    if (!this.selectedFile) {

      this.errorMessage =
        'Please choose a logo image first';

      return;
    }

    if (this.saving) {
      return;
    }

    this.saving = true;

    this.errorMessage = '';

    this.settingsService
      .uploadLogo(this.selectedFile)
      .subscribe({

        next: (res: SiteSettings) => {

          this.logoUrl =
            res?.logoUrl || this.logoUrl;

          this.selectedFile = null;

          this.previewUrl = null;

          this.saving = false;

          this.cdr.detectChanges();

          alert(
            'Logo updated successfully'
          );
        },

        error: (err: any) => {

          console.error(
            'Logo upload failed',
            err
          );

          this.saving = false;

          this.errorMessage =
            err?.error?.message ||
            err?.error ||
            'Logo upload failed. Please try again.';

          this.cdr.detectChanges();
        }
      });
  }
}
