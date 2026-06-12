import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './purchase-history.html',
  styleUrls: ['./purchase-history.css']
})
export class PurchaseHistory implements OnInit {

  apiUrl =
    'https://superbangladesh-api-1.onrender.com';

  purchases: any[] = [];

  filteredPurchases: any[] = [];

  loading = true;

  totalPurchase = 0;

  totalProfit = 0;
  totalDue = 0;

  searchText = '';

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.loadPurchases();
  }

  // LOAD PURCHASES
  loadPurchases() {

    console.log('LOAD PURCHASES CALLED');

    this.http
      .get<any[]>(
        `${this.apiUrl}/api/purchases`
      )
      .subscribe({

        next: (res) => {

          console.log(
            'PURCHASES:',
            res
          );

          this.purchases =
            (res || []).reverse();

          this.filteredPurchases =
            this.purchases;

          this.calculateTotals();

          this.loading = false;
        },

        error: (err) => {

          console.log(
            'PURCHASE ERROR:',
            err
          );

          this.loading = false;
        }
      });
  }

  // TOTALS
 calculateTotals() {

  this.totalPurchase = 0;

  this.totalProfit = 0;

  this.totalDue = 0;

  this.filteredPurchases.forEach(
    purchase => {

      this.totalPurchase +=
        purchase.totalAmount || 0;

      this.totalDue +=
        (
          purchase.totalAmount || 0
        )
        -
        (
          purchase.paidAmount || 0
        );

      purchase.items?.forEach(
        (item: any) => {

          const profit =

            (
              item.sellPrice -
              item.unitPrice
            )

            * item.quantity;

          this.totalProfit +=
            profit;
        }
      );
    }
  );
}

  // SEARCH
  search() {

    const text =
      this.searchText
        .toLowerCase();

    this.filteredPurchases =

      this.purchases.filter(
        p =>

          p.supplierName
            ?.toLowerCase()
            .includes(text)
      );

    this.calculateTotals();
  }

  // DELETE
  deletePurchase(
    id: number
  ) {

    const ok = confirm(
      'Delete this purchase history?'
    );

    if (!ok) return;

    this.http
      .delete(
        `${this.apiUrl}/api/purchases/${id}`
      )
      .subscribe({

        next: () => {

          this.loadPurchases();
        },

        error: (err) => {

          console.log(
            'DELETE ERROR:',
            err
          );
        }
      });
  }
}