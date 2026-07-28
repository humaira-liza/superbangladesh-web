import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-admin-receipt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-receipt.html',
  styleUrls: ['./admin-receipt.css']
})
export class AdminReceipt implements OnInit {

  order: any;

  API =
    'https://superbangladesh-api-1.onrender.com/api/orders';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.http
        .get(`${this.API}/${id}`)
        .subscribe({

          next: (res: any) => {

            this.order = res;

            console.log(res);

          },

          error: (err) => {

            console.log(err);

          }

        });

    }

  }

 printReceipt() {

  document.title =
    `Receipt-${this.order.invoiceNumber}`;

  window.print();

}

 downloadPdf() {

  const receipt = document.getElementById('receipt');

  if (!receipt) {
    return;
  }

  // Button hide
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

    pdf.save(
      `Receipt-${this.order.id}.pdf`
    );

    // Button আবার দেখাও
    if (buttons) {
      buttons.style.display = 'block';
    }

  });

}

}