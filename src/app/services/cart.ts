import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  items: any[] = [];

  add(product: any) {

    const found = this.items.find(p => p.id === product.id);

    if (found) {
      found.qty++;
    } else {
      this.items.push({ ...product, qty: 1 });
    }
  }

  increase(product: any) {
    product.qty++;
  }

  decrease(product: any) {
    if (product.qty > 1) {
      product.qty--;
    }
  }

  remove(product: any) {
    this.items = this.items.filter(p => p.id !== product.id);
  }

  clear() {
    this.items = [];
  }

  getItems() {
    return this.items;
  }

  getTotal() {
    return this.items.reduce((total, p) => total + p.price * p.qty, 0);
  }

  // 🔥 THIS WAS MISSING
  count() {
    return this.items.reduce((a, b) => a + b.qty, 0);
  }
}