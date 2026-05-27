import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-orders',

  imports: [CommonModule],

  templateUrl: './orders.html',

  styleUrls: ['./orders.scss']
})
export class Orders implements OnInit {

  orders: any[] = [];

  loading = true;

  // ✅ BACKEND URL
  apiUrl =
    'https://superbangladesh-api-1.onrender.com';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {

    this.loadOrders();
  }

  loadOrders() {

    console.log("🚀 LOADING ORDERS...");

    const token =
      localStorage.getItem('token');

    console.log("🔐 TOKEN:", token);

    if (!token) {

      alert('Login required');

      this.router.navigate(['/login']);

      return;
    }

    this.loading = true;

    const headers = new HttpHeaders({

      Authorization: `Bearer ${token}`

    });

    this.http.get<any[]>(

      `${this.apiUrl}/api/orders/my`,

      { headers }

    )
    .subscribe({

      next: (res) => {

        console.log(
          "✅ USER ORDERS RESPONSE:",
          res
        );

        this.orders = (res || []).sort(
          (a, b) => b.id - a.id
        );

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (err) => {

        console.log(
          "❌ ORDERS API ERROR:",
          err
        );

        console.log(
          "❌ ERROR BODY:",
          err?.error
        );

        console.log(
          "❌ STATUS:",
          err?.status
        );

        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  deleteOrder(id: number) {

    const token =
      localStorage.getItem('token');

    if (!token) return;

    const headers = new HttpHeaders({

      Authorization: `Bearer ${token}`

    });

    this.http.delete(

      `${this.apiUrl}/api/orders/${id}`,

      { headers }

    )
    .subscribe({

      next: () => {

        console.log("✅ ORDER DELETED");

        this.loadOrders();
      },

      error: (err) => {

        console.log(
          "❌ DELETE ERROR:",
          err
        );
      }
    });
  }
}