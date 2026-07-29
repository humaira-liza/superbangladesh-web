import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private api = 'https://superbangladesh-api-1.onrender.com/api/products';

  constructor(
    private http: HttpClient
  ) {}

  // ==========================
  // ALL PRODUCTS
  // ==========================
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  // ==========================
  // PRODUCT DETAILS
  // ==========================
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  // ==========================
  // CATEGORY PRODUCTS
  // ==========================
  getByCategory(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/category/${id}`);
  }

  // ==========================
  // SEARCH PRODUCTS
  // ==========================
  searchProducts(
    keyword: string
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.api}/search?keyword=${encodeURIComponent(keyword)}`
    );
  }

  // ==========================
  // ADD PRODUCT
  // ==========================
  addProduct(
    data: any
  ): Observable<any> {

    return this.http.post<any>(
      this.api,
      data
    );
  }

  // ==========================
  // UPDATE PRODUCT
  // ==========================
  updateProduct(
    id: number,
    data: any
  ): Observable<any> {

    return this.http.put<any>(
      `${this.api}/${id}`,
      data
    );
  }

  // ==========================
  // DELETE PRODUCT
  // ==========================
  deleteProduct(
    id: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${this.api}/${id}`
    );
  }

  // ==========================
  // IMAGE UPLOAD
  // ==========================
  uploadImage(
    file: File,
    folder: string
  ): Observable<string> {

    const formData = new FormData();

    formData.append(
      'file',
      file
    );

    formData.append(
      'folder',
      folder
    );

    return this.http.post(
      `${this.api}/upload`,
      formData,
      {
        responseType: 'text'
      }
    );
  }

}