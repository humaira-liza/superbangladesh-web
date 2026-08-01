import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CartService } from '../../services/cart';
import { Product } from '../../models/product.model';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class Cart implements OnInit {

  items: Product[] = [];

  constructor(
    private cartService: CartService,
    private router: Router,
    public languageService: LanguageService
  ) {}

  t(key: string): string {
    return this.languageService.translate(key);
  }

  ngOnInit(): void {

    this.items = this.cartService.getItems();

  }

  inc(p: Product): void {

    this.cartService.increase(p);

  }

  dec(p: Product): void {

    this.cartService.decrease(p);

  }

  getTotal(): number {

    return this.cartService.getTotal();

  }

  goCheckout(): void {

    this.router.navigate(['/checkout']);

  }

}