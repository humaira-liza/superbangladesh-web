import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-customers.html',
  styleUrls: ['./admin-customers.css']
})
export class AdminCustomers {

  customers = [
    {
      id: 1,
      name: 'Habibur Rahman',
      email: 'habib@gmail.com',
      phone: '01711111111',
      orders: 5,
      totalSpent: 4500
    },

    {
      id: 2,
      name: 'Humaira Liza',
      email: 'liza@gmail.com',
      phone: '01537521368',
      orders: 3,
      totalSpent: 2200
    }
  ];

}