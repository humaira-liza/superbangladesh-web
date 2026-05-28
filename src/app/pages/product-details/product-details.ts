import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.html'
})

export class ProductDetails implements OnInit {

  product: any;

  apiUrl =
    'https://superbangladesh-api-1.onrender.com';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cart: CartService
  ) {}

  ngOnInit(): void {

    const id =
      this.route.snapshot.params['id'];

    this.http.get(

      `${this.apiUrl}/api/products/${id}`

    ).subscribe({

      next: (res: any) => {

        console.log(
          'PRODUCT DETAILS:',
          res
        );

        this.product = res;
      },

      error: (err) => {

        console.log(
          'PRODUCT ERROR:',
          err
        );
      }
    });
  }

  addToCart(): void {

    this.cart.add(this.product);

    alert('Added to cart ✅');
  }
}