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

  styleUrls: ['./orders.scss'] // 🔥 THIS WAS MISSING
})
export class Orders implements OnInit {

  orders: any[] = [];
  loading = true;

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
      'http://superbangladesh-api-1.onrender.com/api/orders/my',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .subscribe({

      next: (res) => {

        console.log("USER ORDERS:", res);

        // 🔥 NEWEST ORDER FIRST
        this.orders = (res || []).sort(
          (a,b) => b.id - a.id
        );

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (err) => {

        console.error(err);

        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  deleteOrder(id:number) {

    const token = localStorage.getItem('token');

    this.http.delete(
      `http://superbangladesh-api-1.onrender.com/api/orders/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .subscribe(() => this.loadOrders());
  }
}