
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  paidAmount = 0;

  // ✅ BACKEND URL
  apiUrl =
    'https://superbangladesh-api-1.onrender.com';

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

    console.log("🛒 CART ITEMS:", this.items);

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

    console.log("🔐 CHECKOUT TOKEN:", token);

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

      paidAmount: this.paidAmount,

      items: this.items.map((i: any) => ({

        productId: i.id,

        productName: i.name,

        // ✅ FIXED
        quantity:
          i.quantity ||
          i.qty ||
          1,

        price: i.price
      }))
    };

    console.log(
      "📦 ORDER DATA:",
      orderData
    );

    console.log(
      "🛒 FINAL ORDER JSON:",
      JSON.stringify(orderData)
    );

    const headers = new HttpHeaders({

      Authorization: `Bearer ${token}`

    });

    this.http.post(

      `${this.apiUrl}/api/orders`,

      orderData,

      { headers }

    )
    .subscribe({

      next: (res) => {

        console.log(
          "✅ ORDER SUCCESS:",
          res
        );

        this.cart.clear();

        alert('Order placed successfully ✅');

        this.router.navigate(['/orders']);
      },

      error: (err) => {

        console.log(
          "❌ ORDER ERROR:",
          err
        );

        console.log(
          "❌ ERROR BODY:",
          err?.error
        );

        alert(
          err?.error?.message ||
          'Order failed ❌'
        );
      }
    });
  }
}
