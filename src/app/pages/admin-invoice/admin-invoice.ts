import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { BnNumberPipe } from '../../pipes/bn-number.pipe';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-admin-invoice',
  standalone: true,
  imports: [CommonModule, BnNumberPipe],
  templateUrl: './admin-invoice.html',
  styleUrls: ['./admin-invoice.css']
})
export class AdminInvoice implements OnInit, OnDestroy {

  order: any = null;
  loading = true;

  API = 'https://superbangladesh-api-1.onrender.com/api/orders';

  private routeSub?: Subscription;
  private apiSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.routeSub = this.route.paramMap.subscribe(params => {

      const id = params.get('id');

      if (!id) {
        this.loading = false;
        this.order = null;
        this.cdr.detectChanges();
        return;
      }

      this.loadOrder(id);

    });

  }

  loadOrder(id: string): void {

    this.loading = true;
    this.order = null;

    this.apiSub?.unsubscribe();

    this.apiSub = this.http
      .get<any>(`${this.API}/${id}`)
      .subscribe({

        next: (res) => {

          this.order = res;
          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error('Failed to load invoice:', err);

          this.loading = false;
          this.order = null;

          this.cdr.detectChanges();

        }

      });

  }

  goBack(): void {
    this.router.navigate(['/admin/orders']);
  }

  printInvoice(): void {
    window.print();
  }

  downloadPdf(): void {

    const invoice =
      document.querySelector('.invoice-card') as HTMLElement;

    if (!invoice) {
      return;
    }

    const topBar =
      document.querySelector('.top-bar') as HTMLElement;

    if (topBar) {
      topBar.style.display = 'none';
    }

    html2canvas(invoice, { scale: 2 }).then(canvas => {

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
