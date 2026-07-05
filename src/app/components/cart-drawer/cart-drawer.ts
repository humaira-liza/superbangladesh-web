import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.css'
})
export class CartDrawer {

  @Output() closeDrawer =
    new EventEmitter<void>();

  apiUrl =
    'https://superbangladesh-api-1.onrender.com';

  constructor(
    public cart: CartService,
    private router: Router
  ) {}

  close() {
    this.closeDrawer.emit();
  }

  getImage(url: string) {

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

  onImgError(event: Event) {

    const img =
      event.target as HTMLImageElement;

    img.src = 'assets/no-image.png';
  }

  increaseItem(item: any) {

    if (
      item.stock === undefined ||
      item.stock === null ||
      item.qty < item.stock
    ) {
      this.cart.increase(item);
    }
  }

  decreaseItem(item: any) {

    if (item.qty > 1) {
      this.cart.decrease(item);
    } else {
      this.cart.remove(item);
    }
  }

  checkout() {
    this.close();
    this.router.navigate(['/checkout']);
  }
}