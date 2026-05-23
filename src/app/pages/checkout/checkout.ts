import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CartService } from '../../services/cart';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss']
})
export class Checkout implements OnInit {

  items: any[] = [];

  total: number = 0;

  name = '';
  phone = '';
  address = '';

  payment = 'BKASH';

  constructor(
    private cart: CartService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    const token = localStorage.getItem('token');

    if (!token) {

      alert('Login required to checkout 🔐');

      this.router.navigate(['/login']);

      return;
    }

    this.items = this.cart.getItems();

    this.total = this.cart.getTotal();
  }

  placeOrder(): void {

    if (
      !this.name ||
      !this.phone ||
      !this.address
    ) {

      alert('Fill all fields ❌');

      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {

      alert('Login first ❌');

      this.router.navigate(['/login']);

      return;
    }

    const orderData = {

      name: this.name,

      phone: this.phone,

      address: this.address,

      totalAmount: this.total + 60,

      paymentMethod: this.payment,

      items: this.items.map((i: any) => ({

        productId: i.id,

        productName: i.name,

        quantity: i.qty || 1,

        price: i.price

      }))
    };

    this.http.post(

      'http://superbangladesh-api-1.onrender.com/api/orders',

      orderData,

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    ).subscribe({

      next: () => {

        this.cart.clear();

        alert('Order placed successfully ✅');

        this.router.navigate(['/orders']);
      },

      error: (err) => {

        console.error(err);

        alert('Order failed ❌');
      }
    });
  }

}