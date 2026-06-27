import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private http = inject(HttpClient);

  private API =
    'https://superbangladesh-api-1.onrender.com/api/admin/customers';

  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }

}