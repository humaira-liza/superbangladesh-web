import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

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

  API =
    'https://superbangladesh-api-1.onrender.com/api/orders';

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
      DONE: 'statusDone'
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
    this.load();
  }

  load() {

    this.loading = true;

    this.http
      .get<any[]>(`${this.API}/all`)
      .subscribe({

        next: (res) => {

          this.orders = res || [];

          this.totalAmount =
            this.orders.reduce(
              (sum, o) =>
                sum + (o.totalAmount || 0),
              0
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

  updateStatus(o: any) {

    this.http
      .put(
        `${this.API}/${o.id}/status`,
        {}
      )
      .subscribe(() => this.load());
  }

  delete(id: number) {

    if (
      confirm(this.t('confirmDeleteOrder'))
    ) {

      this.http
        .delete(
          `${this.API}/${id}`
        )
        .subscribe(() => this.load());
    }
  }

  trackById(
    index: number,
    item: any
  ) {

    return item.id;
  }

  openInvoice(id: number) {

  this.router.navigate([
    '/admin/orders',
    id,
    'invoice'
  ]);

}

openReceipt(id: number) {

  this.router.navigate([
    '/admin/orders',
    id,
    'receipt'
  ]);

}

}
