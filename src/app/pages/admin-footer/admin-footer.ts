import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
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
  Subject,
  takeUntil
} from 'rxjs';


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
  implements OnInit, OnDestroy {

  loading = true;

  saving = false;

  footerId: number | null = null;


  readonly api =
    'https://superbangladesh-api-1.onrender.com/api/footer-settings';


  private destroy$ =
    new Subject<void>();


  form =
    this.getDefaultForm();


  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.load();
  }


  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();
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

    /*
     প্রথম click এ loading panel দেখাবে
    */

    this.loading = true;

    this.cdr.detectChanges();


    this.http
      .get<any[]>(this.api)

      .pipe(
        takeUntil(
          this.destroy$
        )
      )

      .subscribe({

        next: (res: any[]) => {

          const items =
            Array.isArray(res)
              ? res
              : [];


          if (items.length > 0) {

            const item =
              items[
                items.length - 1
              ];


            this.footerId =
              item?.id != null
                ? Number(item.id)
                : null;


            this.form = {

              ...this.getDefaultForm(),

              ...item,

              active:
                item?.active !== false
            };

          } else {

            this.footerId =
              null;


            this.form =
              this.getDefaultForm();
          }


          /*
           গুরুত্বপূর্ণ:
           data পাওয়ার পর সরাসরি panel open
          */

          this.loading = false;

          this.cdr.detectChanges();
        },


        error: (err: any) => {

          console.error(
            'Footer settings load failed',
            err
          );


          /*
           API error হলেও loading screen
           আটকে থাকবে না
          */

          this.footerId =
            null;


          this.form =
            this.getDefaultForm();


          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }


  save(): void {

    if (this.saving) {
      return;
    }


    const brandTitle =
      String(
        this.form.brandTitle || ''
      ).trim();


    if (!brandTitle) {

      alert(
        'Brand title is required'
      );

      return;
    }


    this.saving = true;

    this.cdr.detectChanges();


    const payload = {

      ...this.form,

      brandTitle
    };


    const request$ =
      this.footerId !== null

        ? this.http.put<any>(
            `${this.api}/${this.footerId}`,
            payload
          )

        : this.http.post<any>(
            this.api,
            payload
          );


    request$
      .pipe(
        takeUntil(
          this.destroy$
        )
      )

      .subscribe({

        next: (saved: any) => {

          if (
            saved?.id != null
          ) {

            this.footerId =
              Number(saved.id);
          }


          if (saved) {

            this.form = {

              ...this.getDefaultForm(),

              ...saved,

              active:
                saved.active !== false
            };
          }


          this.saving = false;

          this.cdr.detectChanges();


          alert(
            'Footer Saved Successfully'
          );
        },


        error: (err: any) => {

          console.error(
            'Footer save failed',
            err
          );


          this.saving = false;

          this.cdr.detectChanges();


          alert(
            err?.error?.message ||
            err?.error ||
            'Footer save failed'
          );
        }

      });
  }
}