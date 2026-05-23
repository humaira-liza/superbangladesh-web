import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private api = 'http://superbangladesh-api-1.onrender.com/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(this.api);
  }

  getByCategory(id: number): Observable<any> {
    return this.http.get(`${this.api}/category/${id}`);
  }

  addProduct(data: any): Observable<any> {
    return this.http.post(this.api, data);
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  uploadImage(file: File, folder: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return this.http.post(this.api + '/upload', formData, {
      responseType: 'text'
    });
  }
}