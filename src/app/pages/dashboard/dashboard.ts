import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterModule
} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  totalProducts = 0;
  totalOrders = 0;
  totalRevenue = 0;
  totalComplaints = 0;

  totalInvest = 0;
  totalProfit = 0;

  lowStock:any[] = [];
  outOfStock:any[] = [];
  bestSales:any[] = [];

  loading = true;

  constructor(
  private http: HttpClient,
  private cdr: ChangeDetectorRef,
  private router: Router
) {}

  ngOnInit() {
    this.load();
  }

  load() {

    const email =
      localStorage.getItem('userEmail') ||
      localStorage.getItem('email');

      console.log('EMAIL =', email);

console.log('URL =', `/api/dashboard?email=${email}`);

   this.http.get<any>(
  `https://superbangladesh-api-1.onrender.com/api/dashboard?email=${email}`
)
    .subscribe({

      next: (res) => {

        console.log('DASHBOARD RESPONSE =', res);

        this.totalProducts = res.totalProducts || 0;
        this.totalOrders = res.totalOrders || 0;
        this.totalRevenue = res.totalRevenue || 0;
        this.totalComplaints = res.totalComplaints || 0;

        this.totalInvest = res.totalInvest || 0;
        this.totalProfit = res.totalProfit || 0;

        this.lowStock = res.lowStock || [];
        this.outOfStock = res.outOfStock || [];
        this.bestSales = res.bestSales || [];

        this.loading = false;

        this.cdr.detectChanges();
      },

     error: (err) => {

  console.log('DASHBOARD ERROR =', err);

  console.log('STATUS =', err.status);

  console.log('ERROR BODY =', err.error);

  this.loading = false;

  this.cdr.detectChanges();
}
    });
  }

  // IMAGE URL — mirrors admin-products' getImage() so Best Sales,
  // Low Stock and Out Of Stock thumbnails resolve correctly instead
  // of pointing at a broken "<api-root>/<filename>" URL.
  getImage(url: string): string {

    if (!url || url === 'null') {
      return 'assets/no-image.png';
    }

    if (url.startsWith('http')) {
      return url;
    }

    return `https://superbangladesh-api-1.onrender.com/images/${url}`;
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/no-image.png';
  }

  logout(): void {

  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('email');
  localStorage.removeItem('role');

  this.router.navigate(['/login']);

}
}