import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  HttpClient
} from '@angular/common/http';

import {
  LanguageService
} from '../../services/language.service';


@Component({
  selector: 'app-footer',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './footer.html',

  styleUrls: [
    './footer.css'
  ]
})
export class Footer
  implements OnInit {

  loading = true;

  footer: any = null;


  readonly api =
    'https://superbangladesh-api-1.onrender.com/api/footer-settings/active';


  constructor(
    public languageService:
      LanguageService,

    private http:
      HttpClient
  ) {}


  ngOnInit(): void {

    this.loadFooter();
  }


  loadFooter(): void {

    this.loading = true;


    this.http
      .get<any>(this.api)
      .subscribe({

        next: (res: any) => {

          this.footer =
            res || null;

          this.loading = false;
        },


        error: (err: any) => {

          console.error(
            'Footer load failed',
            err
          );

          this.footer = null;

          this.loading = false;
        }

      });
  }


  getPaymentMethods(): string[] {

    const value =
      String(
        this.footer?.paymentMethods || ''
      );


    if (!value.trim()) {

      return [
        'VISA',
        'Mastercard',
        'bKash',
        'Nagad'
      ];
    }


    return value
      .split(',')
      .map(
        (item: string) =>
          item.trim()
      )
      .filter(
        (item: string) =>
          Boolean(item)
      );
  }


  t(
    key: string
  ): string {

    return this.languageService
      .translate(key);
  }
}