import { Routes } from '@angular/router';
import { adminGuard } from './admin.guard';
import { userGuard } from './user.guard';

// 🔓 PUBLIC
import { Home } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { ProductDetails } from './pages/product-details/product-details';

// 🛒 USER
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { Success } from './pages/success/success';
import { Orders } from './pages/orders/orders';

// 🆕 EXTRA PAGES
import { Safety } from './pages/safety';
import { Premium } from './pages/premium';
import { Help } from './pages/help';
import { Complaint } from './pages/complaint';

// 🔴 ADMIN
import { Admin } from './admin/admin';
import { Dashboard } from './pages/dashboard/dashboard';
import { AdminProducts } from './pages/admin-products/admin-products';
import { AdminOrders } from './pages/admin-orders/admin-orders';
import { AdminComplaints } from './pages/admin-complaints/admin-complaints';

// 🔥 NEW PAGES
import { Finance } from './pages/finance/finance';
import { Inventory } from './pages/inventory/inventory';
import { Analytics } from './pages/analytics/analytics';

// 🛒 PURCHASE
import { PurchaseManagement } from './admin/purchase-management/purchase-management';
import { PurchaseHistory } from './pages/purchase-history/purchase-history';

// 🔧 ADMIN EXTRA
import { AdminCategories } from './pages/admin-categories/admin-categories';
import { AdminBanners } from './pages/admin-banners/admin-banners';
import { AdminCustomers } from './pages/admin-customers/admin-customers';

export const routes: Routes = [

  // =========================
  // 🔓 PUBLIC
  // =========================

  {
    path: '',
    component: Home
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'product/:id',
    component: ProductDetails
  },

  // =========================
  // 🆕 CATEGORY PAGE
  // =========================

  {
    path: 'category/:id',
    loadComponent: () =>
      import('./pages/category-page/category-page')
        .then(m => m.CategoryPage)
  },

  // =========================
  // 🛒 USER
  // =========================

  {
    path: 'cart',
    component: Cart
  },

  // 📦 USER ORDERS
  {
    path: 'orders',
    component: Orders,
    canActivate: [userGuard]
  },

  // 🔐 USER PROTECTED
  {
    path: 'checkout',
    component: Checkout,
    canActivate: [userGuard]
  },

  {
    path: 'success',
    component: Success,
    canActivate: [userGuard]
  },

  // =========================
  // 🆕 EXTRA
  // =========================

  {
    path: 'safety',
    component: Safety
  },

  {
    path: 'premium',
    component: Premium
  },

  {
    path: 'help',
    component: Help
  },

  {
    path: 'complaint',
    component: Complaint
  },

  // =========================
  // 🔴 ADMIN PANEL
  // =========================

  {
    path: 'admin',
    component: Admin,
    canActivate: [adminGuard],

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: Dashboard
      },

      {
        path: 'products',
        component: AdminProducts
      },

      {
        path: 'categories',
        component: AdminCategories
      },

      {
        path: 'banners',
        component: AdminBanners
      },

      {
        path: 'customers',
        component: AdminCustomers
      },

      {
        path: 'orders',
        component: AdminOrders
      },

      {
        path: 'complaints',
        component: AdminComplaints
      },

      // 🔥 ANALYTICS
      {
        path: 'analytics',
        component: Analytics
      },

      // 🔥 FINANCE
      {
        path: 'finance',
        component: Finance
      },

      // 🔥 INVENTORY
      {
        path: 'inventory',
        component: Inventory
      },

      // 🛒 PURCHASE MANAGEMENT
      {
        path: 'purchase-management',
        component: PurchaseManagement
      },

      // 📦 PURCHASE HISTORY
      {
        path: 'purchase-history',
        component: PurchaseHistory
      },

      // 🚚 SUPPLIERS
      {
        path: 'suppliers',
        loadComponent: () =>
          import('./admin/suppliers/suppliers')
            .then(m => m.Suppliers)
      }

    ]
  },

  {
    path: '**',
    redirectTo: ''
  }

];