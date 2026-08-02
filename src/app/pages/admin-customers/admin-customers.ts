import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-customers.html',
  styleUrls: ['./admin-customers.css']
})
export class AdminCustomers implements OnInit {

  private customerService = inject(CustomerService);
  public languageService = inject(LanguageService);

  t(key: string): string {
    return this.languageService.translate(key);
  }

  customers: any[] = [];

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {

    this.customerService
      .getCustomers()
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

  deleteCustomer(id: number) {

    if (!confirm(this.t('confirmDeleteCustomer'))) {
      return;
    }

    this.customerService
      .deleteCustomer(id)
      .subscribe({

        next: () => {

          this.customers =
            this.customers.filter(
              c => c.id !== id
            );

          alert(
            this.t('customerDeletedSuccess')
          );
        },

        error: (err) => {

          console.error(err);

          alert(this.t('deleteFailed'));
        }

      });
  }

  toggleBlock(customer: any) {

    this.customerService
      .toggleBlock(customer.id)
      .subscribe({

        next: (updated: any) => {

          customer.blocked =
            updated.blocked;

        },

        error: (err) => {

          console.error(err);

          alert(
            this.t('blockUnblockFailed')
          );
        }

      });
  }
}