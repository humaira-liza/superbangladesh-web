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
  selector: 'app-popular-brands',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './popular-brands.html',

  styleUrls: [
    './popular-brands.css'
  ]
})
export class PopularBrands
  implements OnInit {

  brands: any[] = [];

  loading = true;


  readonly api =
    'https://superbangladesh-api-1.onrender.com/api/popular-brands/active';


  constructor(
    private http: HttpClient,
    public languageService: LanguageService
  ) {}

  t(key: string): string {
    return this.languageService.translate(key);
  }


  ngOnInit(): void {

    this.loadBrands();
  }


  loadBrands(): void {

    this.loading = true;


    this.http
      .get<any[]>(
        this.api
      )
      .subscribe({

        next: (res: any[]) => {

          this.brands =
            Array.isArray(res)
              ? res
              : [];


          this.loading = false;
        },


        error: (err: any) => {

          console.error(
            'Popular Brands load failed',
            err
          );


          this.brands = [];

          this.loading = false;
        }

      });
  }


  onImageError(
    event: Event
  ): void {

    const img =
      event.target as HTMLImageElement;


    if (!img) {
      return;
    }


    img.style.display =
      'none';
  }


  trackByBrand(
    index: number,
    brand: any
  ): any {

    return (
      brand?.id ??
      index
    );
  }
}