import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-purchase.html'
})
export class AdminPurchase implements OnInit {

  supplierName = '';
  supplierContact = '';
  notes = '';

  items: any[] = [];

  // 🔥 IMPORTANT (error fix)
  orders: any[] = [];

  constructor(private ps: PurchaseService) {}

  ngOnInit() {
    this.loadOrders();
  }

  // 🔥 LOAD PURCHASE LIST
  loadOrders() {
    this.ps.getAll().subscribe((res: any) => {
      this.orders = res;
    });
  }

  // ADD ITEM
  addItem() {
    this.items.push({
      productId: '',
      quantity: 1,
      unitPrice: 0
    });
  }

  // SUBMIT PURCHASE
  submit() {
    const data = {
      supplierName: this.supplierName,
      supplierContact: this.supplierContact,
      notes: this.notes,
      items: this.items
    };

    this.ps.create(data).subscribe(() => {
      alert('Purchase Done ✅');
      this.items = [];
      this.loadOrders();
    });
  }

  // DELETE PURCHASE
  delete(id: number) {
    if (confirm("Delete this purchase?")) {
      this.ps.delete(id).subscribe(() => {
        this.loadOrders();
      });
    }
  }

  // EDIT (temporary)
  editOrder(o: any) {
    alert("Edit coming soon 😎");
  }
}