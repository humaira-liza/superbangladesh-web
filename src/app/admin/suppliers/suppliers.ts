import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suppliers.html',
  styleUrls: ['./suppliers.css']
})
export class Suppliers implements OnInit {

  suppliers:any[] = [];

  name = '';
  phone = '';
  address = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.http.get<any[]>(
      'https://superbangladesh-api-1.onrender.com/api/suppliers'
    )
    .subscribe(res => {
      this.suppliers = res;
    });
  }

  saveSupplier() {

    const body = {
      name: this.name,
      phone: this.phone,
      address: this.address
    };

    this.http.post(
      'https://superbangladesh-api-1.onrender.com/api/suppliers',
      body
    )
    .subscribe(() => {

      this.name = '';
      this.phone = '';
      this.address = '';

      this.loadSuppliers();
    });
  }

  deleteSupplier(id:number) {

    this.http.delete(
      `https://superbangladesh-api-1.onrender.com/api/suppliers/${id}`
    )
    .subscribe(() => {
      this.loadSuppliers();
    });
  }
}