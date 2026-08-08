import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CartService } from '../../services/cart';
import { LanguageService } from '../../services/language.service';
import { BnNumberPipe } from '../../pipes/bn-number.pipe';


@Component({
  selector: 'app-offers',

  standalone: true,

  imports: [
    CommonModule,
    BnNumberPipe
  ],

  templateUrl: './offers.html',

  styleUrls: ['./offers.css']
})
export class Offers implements OnInit {

  apiUrl =
    'https://superbangladesh-api-1.onrender.com';

  allProducts: any[] = [];
  products: any[] = [];

  loading = true;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public cart: CartService,
    public languageService: LanguageService
  ) {}

  t(key: string): string {
    return this.languageService.translate(key);
  }

  ngOnInit(): void {

    this.loading = true;

    this.http
      .get<any[]>(`${this.apiUrl}/api/products`)
      .subscribe({

        next: (res) => {

          this.allProducts =
            Array.isArray(res) ? res : [];

          this.products =
            this.allProducts.filter(
              p => Number(p?.discount) > 0
            );

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: () => {

          this.errorMessage =
            this.t('couldNotLoadProducts');

          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }


  // =========================
  // DISCOUNTED PRICE (rounded)
  // =========================

  getFinalPrice(p: any): number {

    const price = Number(p?.price) || 0;
    const discount = Number(p?.discount) || 0;

    if (!discount) {
      return price;
    }

    return Math.round(price - (price * discount / 100));
  }


  // =========================
  // ADD TO CART
  // =========================

  addToCart(product: any, event?: Event): void {

    event?.preventDefault();
    event?.stopPropagation();

    if (
      product.stock !== undefined &&
      product.stock !== null &&
      Number(product.stock) <= 0
    ) {
      return;
    }

    this.cart.add({
      ...product,
      price: this.getFinalPrice(product)
    });

    this.cdr.detectChanges();
  }

  increaseQty(product: any, event?: Event): void {

    event?.stopPropagation();

    this.cart.increaseByProduct({
      ...product,
      price: this.getFinalPrice(product)
    });

    this.cdr.detectChanges();
  }

  decreaseQty(product: any, event?: Event): void {

    event?.stopPropagation();

    this.cart.decreaseByProduct(product);

    this.cdr.detectChanges();
  }

  getCartQty(product: any): number {
    return this.cart.getQty(product?.id);
  }


  // =========================
  // IMAGE
  // =========================

  getProductImage(url: string): string {

    if (!url) {
      return 'assets/no-image.png';
    }

    if (url.startsWith('http')) {
      return url;
    }

    if (url.startsWith('/uploads')) {
      return `${this.apiUrl}${url}`;
    }

    return `${this.apiUrl}/images/${url}`;
  }

  onImgError(event: Event): void {

    const img = event.target as HTMLImageElement;

    if (img.src.includes('no-image.png')) {
      return;
    }

    img.src = 'assets/no-image.png';
  }

  openProduct(id: number): void {

    if (!id) {
      return;
    }

    this.router.navigate(['/product', id]);
  }

  trackByProduct(index: number, product: any): any {
    return product?.id ?? index;
  }
}
