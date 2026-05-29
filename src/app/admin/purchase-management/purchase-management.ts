import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

@Component({
  selector: 'app-purchase-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './purchase-management.html',
  styleUrls: ['./purchase-management.css']
})
export class PurchaseManagement implements OnInit {

  apiUrl =
    'https://superbangladesh-api-1.onrender.com';

  products: any[] = [];

  categories: string[] = [];

  purchase: any = {

    supplierName: '',
    supplierContact: '',

    items: [
      {
        category: '',
        productId: '',
        search: '',
        quantity: 1,
        unitPrice: 0,
        sellPrice: 0
      }
    ]
  };

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.loadProducts();
  }

  // LOAD PRODUCTS
  loadProducts() {

    this.http.get<any[]>(
      `${this.apiUrl}/api/products`
    )
    .subscribe({

      next: (res) => {

        console.log(
          'PRODUCTS:',
          res
        );

        this.products = res || [];

        this.categories = [

          ...new Set(

            this.products.map(
              p => p.category?.name
            ).filter(Boolean)

          )

        ] as string[];
      },

      error: (err) => {

        console.log(
          'PRODUCT ERROR:',
          err
        );
      }
    });
  }

  // SELECT PRODUCT
  selectProduct(
    item: any,
    product: any
  ) {

    item.productId = product.id;

    item.search = product.name;

    item.sellPrice =
      product.price || 0;
  }

  // SELECTED PRODUCT
  getSelectedProduct(
    productId: any
  ) {

    return this.products.find(
      p => p.id == productId
    );
  }

  // FILTER PRODUCTS
  getFilteredProducts(
    item: any
  ) {

    return this.products.filter(p => {

      const matchCategory =

        !item.category ||

        p.category?.name ===
        item.category;

      const matchSearch =

        !item.search ||

        p.name
          ?.toLowerCase()
          .includes(
            item.search
              .toLowerCase()
          );

      return (
        matchCategory &&
        matchSearch
      );
    });
  }

  // ADD ITEM
  addItem() {

    this.purchase.items.push({

      category: '',
      productId: '',
      search: '',
      quantity: 1,
      unitPrice: 0,
      sellPrice: 0
    });
  }

  // REMOVE ITEM
  removeItem(
    index: number
  ) {

    this.purchase.items.splice(
      index,
      1
    );
  }

  // TOTAL
  getTotal(): number {

    let total = 0;

    for (
      let item of this.purchase.items
    ) {

      total +=
        item.quantity *
        item.unitPrice;
    }

    return total;
  }

  // PROFIT
  getProfit(): number {

    let profit = 0;

    for (
      let item of this.purchase.items
    ) {

      profit += (

        (
          item.sellPrice -
          item.unitPrice
        ) *

        item.quantity
      );
    }

    return profit;
  }

  // SAVE PURCHASE
  savePurchase() {

    const payload = {

      supplierName:
        this.purchase
          .supplierName,

      supplierContact:
        this.purchase
          .supplierContact,

      totalAmount:
        this.getTotal(),

      items:

      this.purchase.items.map(
        (i: any) => ({

          productId:
            Number(i.productId),

          quantity:
            Number(i.quantity),

          unitPrice:
            Number(i.unitPrice),

          sellPrice:
            Number(i.sellPrice)
        })
      )
    };

    console.log(
      'PURCHASE:',
      payload
    );

    this.http.post(

      `${this.apiUrl}/api/purchases`,

      payload

    )
    .subscribe({

      next: () => {

        alert(
          '✅ Purchase Saved'
        );

        this.purchase = {

          supplierName: '',
          supplierContact: '',

          items: [
            {
              category: '',
              productId: '',
              search: '',
              quantity: 1,
              unitPrice: 0,
              sellPrice: 0
            }
          ]
        };
      },

      error: (err) => {

        console.log(
          'SAVE ERROR:',
          err
        );

        alert(
          '❌ Save Failed'
        );
      }
    });
  }
}