import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-admin-receipt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-receipt.html',
  styleUrls: ['./admin-receipt.css']
})
export class AdminReceipt implements OnInit, OnDestroy {

  order: any = null;
  loading = true;

  API = 'https://superbangladesh-api-1.onrender.com/api/orders';

  private routeSub?: Subscription;
  private apiSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
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

          console.error('Failed to load receipt:', err);

          this.loading = false;
          this.order = null;

          this.cdr.detectChanges();

        }

      });

  }

  printReceipt() {

    if (!this.order) {
      return;
    }

    document.title = `Receipt-${this.order.invoiceNumber || this.order.id}`;

    window.print();

  }

  downloadPdf() {

    const receipt = document.getElementById('receipt');

    if (!receipt || !this.order) {
      return;
    }

    const buttons = document.querySelector('.action-buttons') as HTMLElement;

    if (buttons) {
      buttons.style.display = 'none';
    }

    html2canvas(receipt, {
      scale: 3
    }).then(canvas => {

      const img = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, canvas.height * 80 / canvas.width]
      });

      const pdfWidth = 80;
      const pdfHeight = canvas.height * pdfWidth / canvas.width;

      pdf.addImage(
        img,
        'PNG',
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      pdf.save(`Receipt-${this.order.id}.pdf`);

    }).finally(() => {

      if (buttons) {
        buttons.style.display = '';
      }

    });

  }

  ngOnDestroy(): void {

    this.routeSub?.unsubscribe();
    this.apiSub?.unsubscribe();

  }

}
