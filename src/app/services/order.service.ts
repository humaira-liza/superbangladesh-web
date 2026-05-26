import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl = "/api/orders";

  constructor(private http: HttpClient) {}

  // ✅ USER ORDERS
  getMyOrders() {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(
      this.baseUrl + "/my",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  // ✅ CREATE ORDER
  placeOrder(order: any) {
    const token = localStorage.getItem('token');

    return this.http.post(
      this.baseUrl,
      order,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  // 🔴 ADMIN
  getAllOrders() {
    return this.http.get<any[]>(this.baseUrl + "/all");
  }

  // 🔁 STATUS
  updateStatus(order: any) {
    return this.http.put(
      `${this.baseUrl}/${order.id}/status`,
      {}
    );
  }

  // ❌ DELETE
  deleteOrder(id: number) {
    return this.http.delete(
      `${this.baseUrl}/${id}`
    );
  }
}