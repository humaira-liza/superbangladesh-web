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
  finalize
} from 'rxjs/operators';


@Component({
  selector: 'app-admin-footer',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './admin-footer.html',

  styleUrls: [
    './admin-footer.css'
  ]
})
export class AdminFooter
  implements OnInit {

  loading = false;

  saving = false;

  footerId: number | null = null;


  readonly api =
    'https://superbangladesh-api-1.onrender.com/api/footer-settings';


  form = this.getDefaultForm();


  constructor(
    private http: HttpClient
  ) {}


  ngOnInit(): void {

    this.load();
  }


  private getDefaultForm() {

    return {

      brandTitle:
        'Super Bangladesh',

      description:
        'Your trusted online grocery shop. Fresh products, fast delivery and the best prices every day.',

      facebookUrl:
        '',

      youtubeUrl:
        '',

      instagramUrl:
        '',


      customerServiceTitle:
        'Customer Service',

      helpCenterText:
        'Help Center',

      helpCenterUrl:
        '/help',

      contactText:
        'Contact Us',

      contactUrl:
        '/help',

      reportProblemText:
        'Report a Problem',

      reportProblemUrl:
        '/complaint',

      returnPolicyText:
        'Return Policy',

      returnPolicyUrl:
        '#',


      aboutTitle:
        'About Super Bangladesh',

      aboutUsText:
        'About Us',

      aboutUsUrl:
        '#',

      careersText:
        'Careers',

      careersUrl:
        '#',

      termsText:
        'Terms & Conditions',

      termsUrl:
        '#',

      privacyText:
        'Privacy Policy',

      privacyUrl:
        '#',


      contactTitle:
        'Contact Us',

      address:
        'Dhaka, Bangladesh',

      phone:
        '09600-000000',

      email:
        'support@superbangladesh.com',

      openingHours:
        'Open 24/7',

      copyrightText:
        '© 2026 Super Bangladesh. All Rights Reserved.',

      paymentMethods:
        'VISA,Mastercard,bKash,Nagad',

      active:
        true
    };
  }


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

          const items =
            Array.isArray(res)
              ? res
              : [];

          if (!items.length) {

            this.footerId = null;

            return;
          }


          const item =
            items[items.length - 1];


          this.footerId =
            Number(item.id);


          this.form = {

            ...this.getDefaultForm(),

            ...item,

            active:
              item.active !== false
          };
        },


        error: (err: any) => {

          console.error(
            'Footer settings load failed',
            err
          );
        }

      });
  }


  save(): void {

    if (this.saving) {
      return;
    }


    if (
      !String(
        this.form.brandTitle || ''
      ).trim()
    ) {

      alert(
        'Brand title is required'
      );

      return;
    }


    this.saving = true;


    const request$ =
      this.footerId !== null

        ? this.http.put<any>(
            `${this.api}/${this.footerId}`,
            this.form
          )

        : this.http.post<any>(
            this.api,
            this.form
          );


    request$
      .pipe(
        finalize(() => {

          this.saving = false;
        })
      )
      .subscribe({

        next: (saved: any) => {

          if (saved?.id) {

            this.footerId =
              Number(saved.id);
          }


          alert(
            'Footer Saved Successfully'
          );


          this.load();
        },


        error: (err: any) => {

          console.error(
            'Footer save failed',
            err
          );


          alert(
            err?.error?.message ||
            err?.error ||
            'Footer save failed'
          );
        }

      });
  }
}