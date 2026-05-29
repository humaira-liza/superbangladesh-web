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

  purchases: any[] = [];

  filteredPurchases: any[] = [];

  loading = true;

  totalPurchase = 0;

  totalProfit = 0;

  searchText = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

    this.loadPurchases();
  }

  // LOAD
loadPurchases() {

  console.log('LOAD PURCHASES CALLED');

  this.http.get(
    '/api/purchases',
    { responseType: 'text' }
  )
  .subscribe({

    next: (res) => {

      console.log('RAW RESPONSE:');
      console.log(res);

      const data = JSON.parse(res);

      console.log('PARSED DATA:');
      console.log(data);

      this.purchases = data.reverse();

      this.filteredPurchases = this.purchases;

      this.calculateTotals();

      this.loading = false;
    },

    error: (err) => {

      console.log('PURCHASE ERROR:', err);

      this.loading = false;
    }
  });
}

  // TOTALS
  calculateTotals() {

    this.totalPurchase = 0;

    this.totalProfit = 0;

    this.filteredPurchases.forEach(purchase => {

      this.totalPurchase += purchase.totalAmount || 0;

      purchase.items?.forEach((item:any) => {

        const profit =
          (item.sellPrice - item.unitPrice)
          * item.quantity;

        this.totalProfit += profit;

      });

    });
  }

  // SEARCH
  search() {

    const text =
      this.searchText.toLowerCase();

    this.filteredPurchases =
      this.purchases.filter(p =>

        p.supplierName
          ?.toLowerCase()
          .includes(text)

      );

    this.calculateTotals();
  }

  // DELETE
  deletePurchase(id:number) {

    const ok =
      confirm('Delete this purchase history?');

    if (!ok) return;

    this.http
      .delete(`/api/purchases/${id}`)
      .subscribe({

        next: () => {

          this.loadPurchases();
        }
      });
  }
}