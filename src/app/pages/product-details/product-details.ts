import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CartService } from '../../services/cart';
import { LanguageService } from '../../services/language.service';
import { BnNumberPipe } from '../../pipes/bn-number.pipe';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, BnNumberPipe],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css']
})
export class ProductDetails implements OnInit {

  product: any;

  selectedImage = '';

  quantity = 0;

  apiUrl =
    'https://superbangladesh-api-1.onrender.com';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cart: CartService,
    private router: Router,
    public languageService: LanguageService
  ) {}

  t(key: string): string {
    return this.languageService.translate(key);
  }

  categoryName(name: string): string {
    return this.languageService.translateCategory(name);
  }

  ngOnInit(): void {

    const id = this.route.snapshot.params['id'];

    this.http.get(
      `${this.apiUrl}/api/products/${id}`
    ).subscribe({

      next: (res: any) => {

        console.log('PRODUCT DETAILS:', res);

        this.product = res;

        this.selectedImage = res.imageUrl || '';

        this.quantity = this.cart.getQty(res.id);

      },

      error: (err) => {

        console.log('PRODUCT ERROR:', err);

      }

    });

  }

  // IMAGE SUPPORT
  getImage(url: string): string {

    if (!url) {

      return 'assets/no-image.png';
    }

    // Cloudinary URL
    if (url.startsWith('http')) {

      return url;
    }

    // Old Upload Folder
    return `${this.apiUrl}/uploads/${url}`;
  }

  getOriginName(origin: string): string {

    if (!origin) {
      return '';
    }

    return origin
      .replace(/^product\s+of\s+/i, '')
      .trim();

  }

  // =========================
  // DISCOUNTED PRICE (rounded, for cart/checkout)
  // =========================

  getFinalPrice(p: any): number {

    const price = Number(p?.price) || 0;
    const discount = Number(p?.discount) || 0;

    if (!discount) {
      return price;
    }

    return Math.round(price - (price * discount / 100));
  }

  increaseQty(): void {

    this.cart.increaseByProduct({
      ...this.product,
      price: this.getFinalPrice(this.product)
    });

    this.quantity =
      this.cart.getQty(this.product.id);

  }

  decreaseQty(): void {

    this.cart.decreaseByProduct(this.product);

    this.quantity =
      this.cart.getQty(this.product.id);

  }

  addToCart(): void {

    this.cart.add({
      ...this.product,
      price: this.getFinalPrice(this.product)
    });

    this.quantity =
      this.cart.getQty(this.product.id);

  }

  buyNow(): void {

    this.cart.add({
      ...this.product,
      price: this.getFinalPrice(this.product)
    });

    this.router.navigate(['/cart']);

  }

}