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
import { LanguageService } from '../../services/language.service';

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

  // BACKEND URL
  apiUrl =
    'https://superbangladesh-api-1.onrender.com';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public languageService: LanguageService
  ) {}

  /* =========================
     TRANSLATE
  ========================= */

  t(key: string): string {

    return this.languageService.translate(key);
  }

  statusLabel(status: string): string {

    const map: Record<string, string> = {
      NEW: 'statusNew',
      PROCESSING: 'statusProcessing',
      DONE: 'statusDone',
      SHIPPED: 'statusShipped',
      DELIVERED: 'statusDelivered',
      CANCELLED: 'statusCancelled'
    };

    const key = map[(status || '').toUpperCase()];

    return key ? this.t(key) : (status || '');
  }

  mapLink(order: any): string | null {

    if (!order?.latitude || !order?.longitude) {
      return null;
    }

    return `https://www.openstreetmap.org/?mlat=${order.latitude}&mlon=${order.longitude}#map=17/${order.latitude}/${order.longitude}`;
  }

  ngOnInit() {

    this.loadOrders();
  }

  loadOrders() {

    const token =
      localStorage.getItem('token');

    if (!token) {

      alert(this.t('loginFirst'));

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

        this.orders = (res || []).sort(
          (a, b) => b.id - a.id
        );

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: () => {

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

        this.loadOrders();
      },

      error: () => {}
    });
  }
}
