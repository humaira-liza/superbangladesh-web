import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-admin-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-invoice.html',
  styleUrls: ['./admin-invoice.css']
})
export class AdminInvoice implements OnInit, OnDestroy {

  order: any = null;

  API = 'https://superbangladesh-api-1.onrender.com/api/orders';

  private routeSub?: Subscription;
  private apiSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.routeSub = this.route.paramMap.subscribe(params => {

      const id = params.get('id');

      if (!id) {
        this.order = null;
        return;
      }

      this.loadOrder(id);

    });

  }

  loadOrder(id: string): void {

    this.order = null;

    this.apiSub?.unsubscribe();

    this.apiSub = this.http
      .get<any>(`${this.API}/${id}`)
      .subscribe({

        next: (res) => {

       console.log('INVOICE RESPONSE =', res);
console.log('ORDER BEFORE =', this.order);

this.order = res;
console.log('FULL RESPONSE', JSON.stringify(res, null, 2));

console.log('ORDER AFTER =', this.order);
console.log('ORDER IS NULL =', this.order === null);
console.log('ORDER KEYS =', Object.keys(this.order || {}));

        },

        error: (err) => {

          console.error(err);

          this.order = null;

        }

      });

  }

  printInvoice(): void {

    window.print();

  }

  downloadPdf(): void {

    const invoice = document.querySelector('.invoice-card') as HTMLElement;

    if (!invoice) {
      return;
    }

    const topBar = document.querySelector('.top-bar') as HTMLElement;

    if (topBar) {
      topBar.style.display = 'none';
    }

    html2canvas(invoice, {
      scale: 2
    }).then(canvas => {

      const pdf = new jsPDF('p', 'mm', 'a4');

      const width = pdf.internal.pageSize.getWidth();

      const height = canvas.height * width / canvas.width;

      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        width,
        height
      );

      pdf.save(`Invoice-${this.order?.id}.pdf`);

    }).finally(() => {

      if (topBar) {
        topBar.style.display = '';
      }

    });

  }

  ngOnDestroy(): void {

    this.routeSub?.unsubscribe();
    this.apiSub?.unsubscribe();

  }

}