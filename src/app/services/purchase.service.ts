import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  API = 'http://superbangladesh-api-1.onrender.com/api/purchases';

  constructor(private http: HttpClient) {}

  // CREATE
  create(data: any) {
    return this.http.post(this.API, data);
  }

  // GET ALL
  getAll() {
    return this.http.get(this.API);
  }

  // DELETE
  delete(id: number) {
    return this.http.delete(this.API + '/' + id);
  }
}