import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.html',
  styleUrls: ['./inventory.css']
})
export class Inventory implements OnInit {

  lowStock: any[] = [];

  outOfStock: any[] = [];

  loading = true;

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadInventory();

  }

  loadInventory(): void {

    const email =
      localStorage.getItem('userEmail') ||
      localStorage.getItem('email');

    console.log('EMAIL:', email);

    this.http.get<any>(
      `/api/dashboard?email=${email}`
    )
    .subscribe({

      next: (res) => {

        console.log(
          'FULL API RESPONSE:',
          res
        );

        /* IMPORTANT FIX */

        this.lowStock = [
          ...(res?.lowStock || [])
        ];

        this.outOfStock = [
          ...(res?.outOfStock || [])
        ];

        console.log(
          'LOW STOCK:',
          this.lowStock
        );

        console.log(
          'OUT OF STOCK:',
          this.outOfStock
        );

        this.loading = false;

        this.cd.detectChanges();

      },

      error: (err) => {

        console.log(
          'API ERROR:',
          err
        );

        this.loading = false;

        this.cd.detectChanges();

      }

    });

  }

  scrollToSection(
    id: string
  ): void {

    const section =
      document.getElementById(id);

    if (section) {

      section.scrollIntoView({
        behavior: 'smooth'
      });

    }

  }

}