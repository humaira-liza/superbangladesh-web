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

  editingId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSuppliers();
  }

loadSuppliers() {

  this.http.get<any[]>(
    'https://superbangladesh-api-1.onrender.com/api/suppliers'
  )
  .subscribe(res => {

    console.log('SUPPLIERS API:', res);

    this.suppliers = [...res];

  });

}

  editSupplier(s:any) {

    this.editingId = s.id;

    this.name = s.name;
    this.phone = s.phone;
    this.address = s.address;
  }

  saveSupplier() {

    const body = {
      name: this.name,
      phone: this.phone,
      address: this.address
    };

    // UPDATE
    if (this.editingId) {

      this.http.put(
        `https://superbangladesh-api-1.onrender.com/api/suppliers/${this.editingId}`,
        body
      )
      .subscribe((saved:any) => {

  console.log('SAVED:', saved);

  this.resetForm();

  this.loadSuppliers();

});

      return;
    }

    // CREATE
    this.http.post(
      'https://superbangladesh-api-1.onrender.com/api/suppliers',
      body
    )
    .subscribe(() => {

      this.resetForm();
      this.loadSuppliers();

    });
  }

  resetForm() {

    this.editingId = null;

    this.name = '';
    this.phone = '';
    this.address = '';
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