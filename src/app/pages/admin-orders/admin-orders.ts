import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-admin-orders',
  imports: [CommonModule],
  templateUrl: './admin-orders.html',
  styleUrls: ['./admin-orders.css']
})
export class AdminOrders implements OnInit {

  orders: any[] = [];
  totalAmount = 0;
  loading = true;

  API = 'http://localhost:8081/api/orders';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;

    this.http.get<any[]>(this.API + "/all").subscribe({
      next: (res) => {

        console.log("ADMIN ORDERS:", res);

        // 🔥 SET ORDERS
        this.orders = res || [];

        // 🔥 TOTAL CALC
        this.totalAmount = this.orders
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error("ADMIN ERROR:", err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // 🔁 STATUS CHANGE
  updateStatus(o: any) {
    this.http.put(`${this.API}/${o.id}/status`, {})
      .subscribe(() => this.load());
  }

  // ❌ DELETE
  delete(id: number) {
    if(confirm("Delete this order?")) {
      this.http.delete(`${this.API}/${id}`)
        .subscribe(() => this.load());
    }
  }

  // 🔥 TRACK BY
  trackById(index: number, item: any) {
    return item.id;
  }
}