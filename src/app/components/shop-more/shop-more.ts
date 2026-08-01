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

import { LanguageService } from '../../services/language.service';


@Component({
  selector: 'app-shop-more',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './shop-more.html',

  styleUrls: [
    './shop-more.css'
  ]
})
export class ShopMore
  implements OnInit {

  items: any[] = [];

  loading = true;


  readonly api =
    'https://superbangladesh-api-1.onrender.com/api/shop-more/active';


  constructor(
    private http: HttpClient,
    public languageService: LanguageService
  ) {}

  t(key: string): string {
    return this.languageService.translate(key);
  }


  ngOnInit(): void {

    this.loadItems();
  }


  loadItems(): void {

    this.loading = true;


    this.http
      .get<any[]>(this.api)
      .subscribe({

        next: (res: any[]) => {

          this.items =
            Array.isArray(res)
              ? res
              : [];


          this.loading = false;
        },


        error: (err: any) => {

          console.error(
            'Shop More load failed',
            err
          );


          this.items = [];

          this.loading = false;
        }

      });
  }


  onImageError(
    event: Event
  ): void {

    const img =
      event.target as HTMLImageElement;


    if (img) {

      img.style.display =
        'none';
    }
  }
}