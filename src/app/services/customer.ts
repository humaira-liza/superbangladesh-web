import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private http = inject(HttpClient);

  private API =
    'https://superbangladesh-api-1.onrender.com/api/admin/customers';

  private getHeaders(): HttpHeaders {

    const token = localStorage.getItem('token') || '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

  }

  getCustomers(): Observable<any[]> {

    return this.http.get<any[]>(
      this.API,
      {
        headers: this.getHeaders()
      }
    );

  }

  deleteCustomer(id: number) {

    return this.http.delete(
      `${this.API}/${id}`,
      {
        headers: this.getHeaders()
      }
    );

  }

  toggleBlock(id: number) {

    return this.http.put(
      `${this.API}/${id}/toggle-block`,
      {},
      {
        headers: this.getHeaders()
      }
    );

  }

}