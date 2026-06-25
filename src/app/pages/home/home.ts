import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Sidebar } from '../../components/sidebar/sidebar';
import { Banner } from '../../components/banner/banner';

import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart';
import { ProductStateService } from '../../services/product-state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    Banner
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

 mobileMenuOpen = false;

toggleMobileMenu() {
  this.mobileMenuOpen = !this.mobileMenuOpen;
}
  allProducts: any[] = [];
  originalProducts: any[] = [];
  filtered: any[] = [];

  loading = false;

  viewMode:
    'products' |
    'categories'
    = 'products';

  selectedCategory: any = null;

  currentSearch = '';

  breadcrumb: string[] = [];

  // ✅ BACKEND URL
  apiUrl =
    'https://superbangladesh-api-1.onrender.com';

  constructor(
    private productService: ProductService,
    private cart: CartService,
    private state: ProductStateService,
    private cdr: ChangeDetectorRef
  ) {}

 ngOnInit() {

  this.loadAll();

  this.state.search$
    .subscribe(value => {

      this.currentSearch =
        value || '';

      this.applySearch();
    });

 this.state.category$
.subscribe(id => {

  console.log('STATE CATEGORY =', id);

  if (
    id === undefined ||
    id === null ||
    id === 0
  ) {
    return;
  }

  this.loadProducts(Number(id));

});
}
  // =========================
  // LOAD ALL
  // =========================

  loadAll() {

    this.loading = true;

    this.viewMode = 'products';

    this.selectedCategory = null;

    this.productService
      .getProducts()
      .subscribe({

        next: (res) => {

          console.log('ALL = ', res);

          this.originalProducts =
            [...(res || [])];

          this.allProducts =
            [...this.originalProducts];

          this.filtered =
            [...this.allProducts];

          this.loading = false;

          this.applySearch();

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.log(err);

          this.loading = false;

          this.allProducts = [];

          this.filtered = [];

          this.cdr.detectChanges();
        }
      });
  }

  // =========================
  // LOAD CATEGORY PRODUCTS
  // =========================

loadProducts(id: number) {

  console.log('LOAD CATEGORY ID =', id);

  if (!id) {
    return;
  }

  this.loading = true;

  this.viewMode = 'products';

    this.productService
      .getByCategory(id)
      .subscribe({

        next: (res) => {

          console.log('CATEGORY = ', res);

          

          this.allProducts =
            [...(res || [])];

          this.filtered =
            [...this.allProducts];

          this.loading = false;

          this.applySearch();

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.log(err);

          this.loading = false;

          this.allProducts = [];

          this.filtered = [];

          this.cdr.detectChanges();
        }
      });
  }

  // =========================
  // SEARCH
  // =========================

  applySearch() {

    const text =
      this.currentSearch
        ?.trim()
        .toLowerCase();

    if (!text) {

      this.filtered =
        [...this.allProducts];

      return;
    }

    this.filtered =
      this.allProducts.filter(p =>

        p.name
          ?.toLowerCase()
          .includes(text)
      );
  }

  // =========================
  // ALL PRODUCTS
  // =========================

 onAllProducts() {
  
  this.mobileMenuOpen = false;

  this.breadcrumb = ['All Products'];

    this.selectedCategory = null;

    this.viewMode = 'products';

    this.allProducts =
      [...this.originalProducts];

    this.filtered =
      [...this.originalProducts];

    this.applySearch();

    this.cdr.detectChanges();
  }

  // =========================
  // CATEGORY
  // =========================

onCategory(data: any) {

  

  console.log(data);

  this.mobileMenuOpen = false;

  if (!data) return;

  this.state.setSearch('');

  this.allProducts = [];
  this.filtered = [];

  if (
    data.level === 'all' ||
    data.id === 0
  ) {
    this.onAllProducts();
    return;
  }

  this.breadcrumb = [];

  if (data.mainName) {
    this.breadcrumb.push(data.mainName);
  }

  if (
    data.parentName &&
    data.parentName !== data.mainName
  ) {
    this.breadcrumb.push(data.parentName);
  }

  if (data.name) {
    this.breadcrumb.push(data.name);
  }

 // child category থাকলে category page দেখাও
if (data.children && data.children.length > 0) {

  this.selectedCategory = data;

  this.viewMode = 'categories';

  return;
}

// শেষ level হলে products দেখাও
this.selectedCategory = null;

this.loadProducts(data.id);
}

  // =========================
  // IMAGE
  // =========================

getImage(url: string) {

  if (!url) {
    return 'assets/no-image.png';
  }

  if (url.startsWith('http')) {
    return url;
  }

  return `${this.apiUrl}/images/${url}`;
}

getCategoryImage(url: string) {

  if (!url) {
    return 'assets/no-image.png';
  }

  if (url.startsWith('http')) {
    return url;
  }

  return `${this.apiUrl}/images/${url}`;
}

  onImgError(event: any) {

    event.target.src =
      'assets/no-image.png';
  }

  // =========================
  // CART
  // =========================

 addToCart(product: any) {

  if (product.stock > 0) {
    this.cart.add(product);
  }
}

trackByProduct(index: number, item: any) {
  return item.id;
}
}