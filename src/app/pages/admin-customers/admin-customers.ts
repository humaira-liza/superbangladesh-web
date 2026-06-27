import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-customers.html',
  styleUrls: ['./admin-customers.css']
})
export class AdminCustomers implements OnInit {

  private customerService = inject(CustomerService);

  customers: any[] = [];

  ngOnInit(): void {

    this.customerService.getCustomers()
      .subscribe({
        next: (data) => {
          console.log(data);
          this.customers = data;
        },

        error: (err) => {
          console.error(err);
        }
      });

  }

}