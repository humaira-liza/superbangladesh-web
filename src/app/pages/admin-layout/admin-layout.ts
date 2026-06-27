import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="admin-layout">

      <div class="sidebar">

        <a routerLink="/admin/dashboard" routerLinkActive="active">📊 Dashboard</a>
        <a routerLink="/admin/products" routerLinkActive="active">🛒 Products</a>
        <a routerLink="/admin/orders" routerLinkActive="active">📦 Orders</a>
        <a routerLink="/admin/banners" routerLinkActive="active">🖼️ Banners</a>

      </div>

      <div class="content">
        <router-outlet></router-outlet>
      </div>

    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
    }
    .sidebar {
      width: 220px;
      background: #1e293b;
      color: white;
      padding: 15px;
      min-height: 100vh;
    }
    .sidebar a {
      display: block;
      padding: 10px;
      color: white;
      text-decoration: none;
      margin-bottom: 10px;
    }
    .sidebar a.active {
      background: #4f46e5;
      border-radius: 6px;
    }
    .content {
      flex: 1;
      padding: 20px;
    }
  `]
})
export class AdminLayout {}