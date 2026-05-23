import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
 category: {
  id: number;
  name: string;
};
  description?: string;
  image: string;
  stock: number;
  qty?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {

  private apiUrl = 'http://superbangladesh-api-1.onrender.com/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}