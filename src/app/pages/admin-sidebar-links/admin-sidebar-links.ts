import {
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
  HttpClient
} from '@angular/common/http';

import {
  DomSanitizer,
  SafeHtml
} from '@angular/platform-browser';

import {
  finalize
} from 'rxjs/operators';


@Component({
  selector: 'app-admin-sidebar-links',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './admin-sidebar-links.html',

  styleUrls: [
    './admin-sidebar-links.css'
  ]
})
export class AdminSidebarLinks
  implements OnInit {

  links: any[] = [];

  loading = false;

  saving = false;

  editingId: number | null = null;

  togglingId: number | null = null;


  readonly api =
    'https://superbangladesh-api-1.onrender.com/api/sidebar-links';


  // ফিক্সড আইকন লিস্ট — admin এখান থেকেই বেছে নেবে,
  // কোনো emoji/font টাইপ করার দরকার নাই
  readonly iconOptions = [
    { key: 'gift', label: 'Gift' },
    { key: 'star', label: 'Star' },
    { key: 'shield', label: 'Shield' },
    { key: 'award', label: 'Award' },
    { key: 'phone', label: 'Phone' },
    { key: 'alert-triangle', label: 'Alert' },
    { key: 'truck', label: 'Truck' },
    { key: 'tag', label: 'Tag' },
    { key: 'heart', label: 'Heart' },
    { key: 'info', label: 'Info' }
  ];


  private readonly iconLibrary:
    Record<string, string> = {

    gift:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8"/><path d="M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8"/></svg>',

    star:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',

    shield:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',

    award:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',

    phone:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',

    'alert-triangle':
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',

    truck:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',

    tag:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12.01V2h10.01l8.58 8.58a2 2 0 0 1 0 2.83z"/><circle cx="7" cy="7" r="1.5"/></svg>',

    heart:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',

    info:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };


  form = {

    section: 'EXTRA',

    iconKey: 'info',

    labelEn: '',

    labelBn: '',

    route: '',

    active: true,

    adminOnly: false,

    displayOrder: 1

  };


  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}


  ngOnInit(): void {

    this.load();
  }


  // =========================
  // ICON PREVIEW (SAFE HTML)
  // =========================

  getIcon(iconKey: string): SafeHtml {

    const raw =
      this.iconLibrary[iconKey]
      || this.iconLibrary['info'];

    return this.sanitizer
      .bypassSecurityTrustHtml(raw);
  }


  // =========================
  // LOAD
  // =========================

  load(): void {

    if (this.loading) {
      return;
    }

    this.loading = true;

    this.http
      .get<any[]>(this.api)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({

        next: (res: any[]) => {

          this.links =
            Array.isArray(res)
              ? res
              : [];
        },

        error: (err: any) => {

          console.error(
            'Sidebar links load failed',
            err
          );

          this.links = [];
        }

      });
  }


  // =========================
  // SAVE (CREATE / UPDATE)
  // =========================

  save(): void {

    if (this.saving) {
      return;
    }

    const labelEn =
      String(this.form.labelEn || '').trim();

    const labelBn =
      String(this.form.labelBn || '').trim();

    const route =
      String(this.form.route || '').trim();

    if (!labelEn) {
      alert('English label is required');
      return;
    }

    if (!labelBn) {
      alert('Bangla label is required');
      return;
    }

    if (!route) {
      alert('Link (route) is required, e.g. /offers');
      return;
    }

    const order =
      Number(this.form.displayOrder);

    const payload = {

      section: this.form.section,

      iconKey: this.form.iconKey,

      labelEn,

      labelBn,

      route,

      active: Boolean(this.form.active),

      adminOnly: Boolean(this.form.adminOnly),

      displayOrder:
        Number.isFinite(order)
          ? Math.max(0, Math.floor(order))
          : 0

    };

    this.saving = true;

    if (this.editingId !== null) {

      this.http
        .put(`${this.api}/${this.editingId}`, payload)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe({

          next: () => {
            alert('Link Updated');
            this.reset();
            this.load();
          },

          error: (err: any) => {
            console.error('Link update failed', err);
            alert('Link update failed');
          }

        });

      return;
    }

    this.http
      .post(this.api, payload)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe({

        next: () => {
          alert('Link Added');
          this.reset();
          this.load();
        },

        error: (err: any) => {
          console.error('Link add failed', err);
          alert('Link add failed');
        }

      });
  }


  // =========================
  // EDIT
  // =========================

  edit(link: any): void {

    this.editingId = Number(link.id);

    this.form = {

      section: link.section || 'EXTRA',

      iconKey: link.iconKey || 'info',

      labelEn: link.labelEn || '',

      labelBn: link.labelBn || '',

      route: link.route || '',

      active: Boolean(link.active),

      adminOnly: Boolean(link.adminOnly),

      displayOrder: Number(link.displayOrder) || 0

    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  // =========================
  // RESET
  // =========================

  reset(): void {

    this.editingId = null;

    this.form = {

      section: 'EXTRA',

      iconKey: 'info',

      labelEn: '',

      labelBn: '',

      route: '',

      active: true,

      adminOnly: false,

      displayOrder: 1

    };
  }


  // =========================
  // TOGGLE ACTIVE
  // =========================

  toggle(link: any): void {

    if (this.togglingId !== null) {
      return;
    }

    this.togglingId = Number(link.id);

    this.http
      .put(`${this.api}/${link.id}/toggle`, null)
      .pipe(
        finalize(() => {
          this.togglingId = null;
        })
      )
      .subscribe({

        next: () => {
          this.load();
        },

        error: (err: any) => {
          console.error('Link toggle failed', err);
          alert('Link status update failed');
        }

      });
  }


  // =========================
  // DELETE
  // =========================

  delete(id: number): void {

    if (!confirm('Delete this sidebar link?')) {
      return;
    }

    this.http
      .delete(`${this.api}/${id}`)
      .subscribe({

        next: () => {
          this.load();
        },

        error: (err: any) => {
          console.error('Link delete failed', err);
          alert('Link delete failed');
        }

      });
  }
}
