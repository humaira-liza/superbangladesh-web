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
  CategoryService
} from '../../services/category.service';

import {
  CartService
} from '../../services/cart';

import {
  ProductStateService
} from '../../services/product-state.service';

import {
  LanguageService
} from '../../services/language.service';


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


  // =========================
  // POPULAR CATEGORIES
  // ADMIN CONTROLLED
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

    private categoryService:
      CategoryService,

    public cart:
      CartService,

    private state:
      ProductStateService,

    private cdr:
      ChangeDetectorRef,

    public languageService:
      LanguageService
  ) {}


  /* =========================
     TRANSLATE
  ========================= */

  t(
    key: string
  ): string {

    return this.languageService
      .translate(key);
  }


  /* =========================
     CATEGORY NAME
  ========================= */

  categoryName(
    category: any
  ): string {

    return this.languageService
      .translateCategory(
        category?.name
      );
  }


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.loadAll();

    this.loadPopularCategories();


    // SEARCH STATE

    this.state.search$
      .subscribe((value: string) => {

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
      .subscribe((id: number) => {

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
  // LOAD POPULAR CATEGORIES
  // ADMIN CONTROLLED
  // =========================

  loadPopularCategories(): void {

    this.categoryService
      .getPopular()
      .subscribe({

        next: (res: any[]) => {

          console.log(
            'POPULAR CATEGORIES =',
            res
          );

          this.popularCategories =
            Array.isArray(res)
              ? res
              : [];

          this.cdr.detectChanges();
        },

        error: (err: any) => {

          console.error(
            'POPULAR CATEGORY ERROR =',
            err
          );

          this.popularCategories = [];

          this.cdr.detectChanges();
        }

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

        next: (res: any[]) => {

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


          /*
            IMPORTANT:
            Popular Categories আর
            product list থেকে তৈরি হবে না।

            এখন admin controlled
            /api/categories/popular
            endpoint থেকে আসবে।
          */


          this.loading = false;


          this.applySearch();


          this.cdr.detectChanges();
        },


        error: (err: any) => {

          console.error(
            'LOAD ALL ERROR =',
            err
          );


          this.loading = false;


          this.originalProducts = [];

          this.allProducts = [];

          this.filtered = [];


          /*
            এখানে popularCategories
            empty করছি না।

            কারণ Popular Categories
            আলাদা API থেকে load হচ্ছে।
          */


          this.cdr.detectChanges();
        }
      });
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

        next: (res: any[]) => {

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


        error: (err: any) => {

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

   console.log('SEARCH =', this.currentSearch);

  const text = this.currentSearch.trim();

  if (!text) {

    this.filtered = [...this.allProducts];
    return;
  }

  this.loading = true;

  this.productService
      .searchProducts(text)
      .subscribe({

        next: (res: any[]) => {

          this.filtered = [...res];

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: err => {

          console.error(err);

          this.filtered = [];

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
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


    this.allProducts =
      [...this.originalProducts];


    this.filtered =
      [...this.originalProducts];


    this.applySearch();


    this.cdr.detectChanges();


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