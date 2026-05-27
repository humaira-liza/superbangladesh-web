import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
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

    const token = localStorage.getItem('token');

    if (!token) {

      this.router.navigate(['/login']);

      return;
    }

    this.loading = true;

    this.http.get<any[]>(

      `${this.apiUrl}/api/orders/my`,

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    )
    .subscribe({

      next: (res) => {

        console.log("USER ORDERS:", res);

        this.orders = (res || []).sort(
          (a,b) => b.id - a.id
        );

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (err) => {

        console.error("ORDERS ERROR:", err);

        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  deleteOrder(id:number) {

    const token = localStorage.getItem('token');

    this.http.delete(

      `${this.apiUrl}/api/orders/${id}`,

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    )
    .subscribe(() => this.loadOrders());
  }
}