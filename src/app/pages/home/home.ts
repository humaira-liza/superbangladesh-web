import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Sidebar
} from '../../components/sidebar/sidebar';

import {
  Banner
} from '../../components/banner/banner';

import {
  Features
} from '../../components/features/features';

import {
  PopularBrands
} from '../../components/popular-brands/popular-brands';

import {
  ShopMore
} from '../../components/shop-more/shop-more';

import {
  Footer
} from '../../components/footer/footer';

import {
  ProductService
} from '../../services/product.service';

import {
  CartService
} from '../../services/cart';

import {
  ProductStateService
} from '../../services/product-state.service';


@Component({
  selector: 'app-home',

  standalone: true,

  imports: [
    CommonModule,
    Sidebar,
    Banner,
    Features,
    ShopMore,
    PopularBrands,
    Footer
  ],

  templateUrl: './home.html',

  styleUrls: ['./home.css']
})
export class Home implements OnInit {


  // =========================
  // PRODUCTS SECTION
  // =========================

  @ViewChild('productsSection')
  productsSection?: ElementRef<HTMLElement>;


  // =========================
  // MOBILE MENU
  // =========================

  mobileMenuOpen = false;


  // =========================
  // PRODUCTS
  // =========================

  allProducts: any[] = [];

  originalProducts: any[] = [];

  filtered: any[] = [];

  featuredProducts: any[] = [];


  // =========================
  // TRENDING TOGGLE
  // =========================

  showAllTrending = false;


  // =========================
  // POPULAR CATEGORIES
  // =========================

  popularCategories: any[] = [];


  // =========================
  // LOADING
  // =========================

  loading = false;


  // =========================
  // VIEW MODE
  // =========================

  viewMode:
    'products' |
    'categories'
    = 'products';


  // =========================
  // SELECTED CATEGORY
  // =========================

  selectedCategory: any = null;


  // =========================
  // SEARCH
  // =========================

  currentSearch = '';


  // =========================
  // BREADCRUMB
  // =========================

  breadcrumb: string[] = [];


  // =========================
  // API URL
  // =========================

  apiUrl =
    'https://superbangladesh-api-1.onrender.com';


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private productService:
      ProductService,

    public cart:
      CartService,

    private state:
      ProductStateService,

    private cdr:
      ChangeDetectorRef
  ) {}


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.loadAll();


    // SEARCH STATE

    this.state.search$
  .subscribe(value => {

    this.currentSearch =
      value || '';

    this.applySearch();

    this.cdr.detectChanges();

    if (
      this.currentSearch.trim()
    ) {

      setTimeout(() => {

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

      }, 0);

    }

  });

    // CATEGORY STATE

    this.state.category$
      .subscribe(id => {

        console.log(
          'STATE CATEGORY =',
          id
        );


        if (
          id === undefined ||
          id === null ||
          id === 0
        ) {
          return;
        }


        this.loadProducts(
          Number(id)
        );
      });
  }


  // =========================
  // MOBILE MENU
  // =========================

  toggleMobileMenu(): void {

    this.mobileMenuOpen =
      !this.mobileMenuOpen;
  }


  // =========================
  // LOAD ALL PRODUCTS
  // =========================

  loadAll(): void {

    this.loading = true;


    this.viewMode =
      'products';


    this.selectedCategory =
      null;


    this.productService
      .getProducts()
      .subscribe({

        next: (res) => {

          console.log(
            'ALL PRODUCTS =',
            res
          );


          // STORE ALL PRODUCTS

          this.originalProducts =
            [...(res || [])];


          this.allProducts =
            [...this.originalProducts];


          this.filtered =
            [...this.originalProducts];


          // =========================
          // TRENDING PRODUCTS
          // FIRST 10 PRODUCTS
          // =========================

          this.featuredProducts =
            this.originalProducts.slice(
              0,
              10
            );


          // DEFAULT COLLAPSED

          this.showAllTrending =
            false;


          // =========================
          // POPULAR CATEGORIES
          // =========================

          this.popularCategories =
            this.originalProducts

              .filter(
                p => p.category
              )

              .map(
                p => p.category
              )

              .filter(
                (v, i, arr) =>
                  arr.findIndex(
                    x =>
                      Number(x.id) ===
                      Number(v.id)
                  ) === i
              )

              .slice(
                0,
                6
              );


          this.loading = false;


          this.applySearch();


          this.cdr.detectChanges();
        },


        error: (err) => {

          console.error(
            'LOAD ALL ERROR =',
            err
          );


          this.loading = false;


          this.originalProducts = [];

          this.allProducts = [];

          this.filtered = [];

          this.featuredProducts = [];

          this.popularCategories = [];


          this.showAllTrending =
            false;


          this.cdr.detectChanges();
        }
      });
  }


  // =========================
  // TOGGLE ALL TRENDING
  // =========================

  toggleAllTrending(): void {

    this.showAllTrending =
      !this.showAllTrending;


    this.cdr.detectChanges();
  }


  // =========================
  // LOAD CATEGORY PRODUCTS
  // =========================

  loadProducts(
    id: number
  ): void {

    console.log(
      'LOAD CATEGORY ID =',
      id
    );


    if (!id) {
      return;
    }


    this.loading = true;


    this.viewMode =
      'products';


    this.productService
      .getByCategory(id)
      .subscribe({

        next: (res) => {

          console.log(
            'CATEGORY PRODUCTS =',
            res
          );


          this.allProducts =
            [...(res || [])];


          this.filtered =
            [...this.allProducts];


          this.loading = false;


          this.applySearch();


          this.cdr.detectChanges();


          this.scrollToCategorySection();
        },


        error: (err) => {

          console.error(
            'CATEGORY ERROR =',
            err
          );


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

  applySearch(): void {

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
      this.allProducts.filter(

        p =>
          p.name
            ?.toLowerCase()
            .includes(text)
      );
  }


  // =========================
  // SEE ALL PRODUCTS
  // =========================

  onAllProducts(): void {

    console.log(
      'SEE ALL CLICKED'
    );


    this.mobileMenuOpen =
      false;


    this.selectedCategory =
      null;


    this.breadcrumb = [
      'All Products'
    ];


    this.viewMode =
      'products';


    // RESTORE ALL PRODUCTS

    this.allProducts =
      [...this.originalProducts];


    this.filtered =
      [...this.originalProducts];


    // APPLY SEARCH IF ANY

    this.applySearch();


    // UPDATE UI

    this.cdr.detectChanges();


    // SCROLL TO PRODUCTS

    this.scrollToCategorySection();
  }


  // =========================
  // SCROLL TO PRODUCTS
  // =========================

  scrollToCategorySection(): void {

    setTimeout(() => {

      if (!this.productsSection) {

        console.log(
          'productsSection not found'
        );

        return;
      }


      const navbarHeight =
        90;


      const elementTop =

        this.productsSection
          .nativeElement
          .getBoundingClientRect()
          .top

        + window.scrollY;


      window.scrollTo({

        top:
          elementTop -
          navbarHeight -
          15,

        behavior:
          'smooth'
      });

    }, 100);
  }


  // =========================
  // CATEGORY
  // =========================

  onCategory(
    data: any
  ): void {

    console.log(
      'CATEGORY CLICK =',
      data
    );


    this.mobileMenuOpen =
      false;


    if (!data) {
      return;
    }


    this.state.setSearch('');


    this.allProducts = [];

    this.filtered = [];


    // =========================
    // ALL PRODUCTS
    // =========================

    if (
      data.level === 'all' ||
      data.id === 0
    ) {

      this.onAllProducts();

      return;
    }


    // =========================
    // BREADCRUMB
    // =========================

    this.breadcrumb = [];


    if (data.mainName) {

      this.breadcrumb.push(
        data.mainName
      );
    }


    if (
      data.parentName &&
      data.parentName !==
        data.mainName
    ) {

      this.breadcrumb.push(
        data.parentName
      );
    }


    if (data.name) {

      this.breadcrumb.push(
        data.name
      );
    }


    // =========================
    // CATEGORY CHILDREN
    // =========================

    if (
      data.children &&
      data.children.length > 0
    ) {

      this.selectedCategory =
        data;


      this.viewMode =
        'categories';


      this.cdr.detectChanges();


      this.scrollToCategorySection();


      return;
    }


    // =========================
    // FINAL PRODUCTS
    // =========================

    this.selectedCategory =
      null;


    this.viewMode =
      'products';


    this.cdr.detectChanges();


    this.loadProducts(
      Number(data.id)
    );
  }


  // =========================
  // PRODUCT IMAGE
  // =========================

  getImage(
    url: string
  ): string {

    if (!url) {

      return 'assets/no-image.png';
    }


    if (
      url.startsWith('http')
    ) {

      return url;
    }


    if (
      url.startsWith('/uploads')
    ) {

      return `${this.apiUrl}${url}`;
    }


    return (
      `${this.apiUrl}/images/${url}`
    );
  }


  // =========================
  // CATEGORY IMAGE
  // =========================

  getCategoryImage(
    url: string
  ): string {

    if (!url) {

      return 'assets/no-image.png';
    }


    if (
      url.startsWith('http')
    ) {

      return url;
    }


    if (
      url.startsWith('/uploads')
    ) {

      return `${this.apiUrl}${url}`;
    }


    return (
      `${this.apiUrl}/images/${url}`
    );
  }


  // =========================
  // IMAGE ERROR
  // =========================

  onImgError(
    event: any
  ): void {

    event.target.src =
      'assets/no-image.png';
  }


  // =========================
  // ADD TO CART
  // =========================

  addToCart(
    product: any,
    event?: Event
  ): void {

    event?.preventDefault();

    event?.stopPropagation();


    if (
      product.stock !== undefined &&
      product.stock !== null &&
      Number(product.stock) <= 0
    ) {

      return;
    }


    this.cart.add(
      product
    );


    this.cdr.detectChanges();


    // AUTO OPEN CART DRAWER

    window.dispatchEvent(

      new CustomEvent(
        'open-cart-drawer'
      )
    );
  }


  // =========================
  // INCREASE QTY
  // =========================

  increaseQty(
    product: any,
    event?: Event
  ): void {

    event?.preventDefault();

    event?.stopPropagation();


    this.cart.increaseByProduct(
      product
    );


    this.cdr.detectChanges();
  }


  // =========================
  // DECREASE QTY
  // =========================

  decreaseQty(
    product: any,
    event?: Event
  ): void {

    event?.preventDefault();

    event?.stopPropagation();


    this.cart.decreaseByProduct(
      product
    );


    this.cdr.detectChanges();
  }


  // =========================
  // GET CART QTY
  // =========================

  getCartQty(
    product: any
  ): number {

    return this.cart.getQty(
      product?.id
    );
  }


  // =========================
  // IS IN CART
  // =========================

  isInCart(
    product: any
  ): boolean {

    return (
      this.getCartQty(
        product
      ) > 0
    );
  }


  // =========================
  // TRACK BY
  // =========================

  trackByProduct(
    index: number,
    item: any
  ): any {

    return (
      item?.id ??
      index
    );
  }
}