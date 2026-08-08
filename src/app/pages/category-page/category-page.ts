import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { HttpClient } from '@angular/common/http';

import { Sidebar } from '../../components/sidebar/sidebar';

import { CartService } from '../../services/cart';

import { ProductStateService } from '../../services/product-state.service';
import { ProductService } from '../../services/product.service';
import { LanguageService } from '../../services/language.service';
import { BnNumberPipe } from '../../pipes/bn-number.pipe';
import {
  Subject,
  of
} from 'rxjs';

import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  takeUntil
} from 'rxjs/operators';


@Component({
  selector: 'app-category-page',

  standalone: true,

  imports: [
    CommonModule,
    Sidebar,
    BnNumberPipe
  ],

  templateUrl: './category-page.html',

  styleUrls: ['./category-page.css']
})
export class CategoryPage
  implements OnInit, OnDestroy {

  categoryId = 0;

  category: any = null;

  categoryTree: any[] = [];

  breadcrumb: any[] = [];

  products: any[] = [];

  categoryLoading = false;

  productsLoading = false;
  errorMessage = '';

 currentSearch = '';

  private destroy$ =
    new Subject<void>();

  apiUrl =
    'https://superbangladesh-api-1.onrender.com';


constructor(
  private route: ActivatedRoute,
  private router: Router,
  private http: HttpClient,
  public cart: CartService,
  private cdr: ChangeDetectorRef,
  private zone: NgZone,
  private state: ProductStateService,
  private productService: ProductService,
  public languageService: LanguageService
) {}

  t(key: string): string {
    return this.languageService.translate(key);
  }

  categoryName(name: string): string {
    return this.languageService.translateCategory(name);
  }


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.state.search$.subscribe(keyword => {

  this.currentSearch = keyword.trim();

  if (!this.currentSearch) {
    return;
  }

  this.productsLoading = true;

  this.productService
    .searchProducts(this.currentSearch)
    .subscribe(res => {

      this.products = res || [];

      this.productsLoading = false;

      this.cdr.detectChanges();

    });

});

    this.route.paramMap
      .pipe(

        map(params =>
          Number(params.get('id'))
        ),

        filter(id => id > 0),

        distinctUntilChanged(),

        switchMap(id => {

          console.log(
            'CATEGORY PAGE ID =',
            id
          );

          // =========================
          // RESET CURRENT PAGE
          // =========================

          this.zone.run(() => {

            this.categoryId = id;

            this.category = null;

            this.products = [];

            this.errorMessage = '';

            this.categoryLoading = true;

            this.productsLoading = false;

            this.cdr.detectChanges();
          });


          // =========================
          // LOAD CATEGORY TREE
          // =========================

          return this.http
            .get<any[]>(
              `${this.apiUrl}/api/categories/tree`
            )
            .pipe(

              map(res => ({

                id,

                tree:
                  Array.isArray(res)
                    ? res
                    : []
              })),

              catchError(err => {

                console.error(
                  'CATEGORY LOAD ERROR =',
                  err
                );

                return of({

                  id,

                  tree: [] as any[],

                  categoryError: true
                });
              })
            );
        }),

        // =========================
        // HANDLE CATEGORY TREE
        // =========================

        switchMap((result: any) => {
          console.log('RESULT TYPE =', result.type, result);

          const id =
            Number(result.id);

          // পুরনো request ignore
          if (
            id !==
            Number(this.categoryId)
          ) {

            return of({
              type: 'ignore',
              id
            });
          }


          // =========================
          // CATEGORY ERROR
          // =========================

          if (
            result.categoryError
          ) {

            return of({

              type: 'category-error',

              id
            });
          }


          console.log(
            'CATEGORY TREE RESPONSE =',
            result.tree
          );

          // ব্রেডক্রাম্বের জন্য পুরো tree রেখে দিচ্ছি
          this.categoryTree = result.tree;

          const found =
            this.findCategory(
              result.tree,
              id
            );


          console.log(
            'FOUND CATEGORY =',
            found
          );


          // =========================
          // NOT FOUND
          // =========================

          if (!found) {

            return of({

              type: 'not-found',

              id
            });
          }


          const children =
            Array.isArray(
              found?.children
            )
              ? found.children
              : [];


          // =========================
          // CATEGORY HAS CHILDREN
          // =========================

          if (
            children.length > 0
          ) {

            return of({

              type: 'category',

              id,

              category: found
            });
          }


          // =========================
          // LEAF CATEGORY
          // =========================

          this.zone.run(() => {

            this.category =
              found;

            this.breadcrumb =
              this.findCategoryPath(
                this.categoryTree,
                id
              ) || [];

            this.categoryLoading =
              false;

            this.productsLoading =
              true;

            this.cdr.detectChanges();
          });


          // =========================
          // LOAD PRODUCTS
          // =========================

          return this.http
            .get<any[]>(
              `${this.apiUrl}/api/products/category/${id}`
            )
            .pipe(

              map(res => ({

                type: 'products',

                id,

                category: found,

                products:
                  Array.isArray(res)
                    ? res
                    : []
              })),

              catchError(err => {

                console.error(
                  'PRODUCT LOAD ERROR =',
                  err
                );

                return of({

                  type: 'product-error',

                  id,

                  category: found
                });
              })
            );
        }),

        takeUntil(this.destroy$)
      )

      .subscribe((result: any) => {

        // সব UI update Angular zone-এর ভিতরে
        this.zone.run(() => {

          // =========================
          // IGNORE
          // =========================

          if (
            result.type === 'ignore'
          ) {

            return;
          }


          // পুরনো result হলে ignore
          if (
            result.id &&
            Number(result.id) !==
            Number(this.categoryId)
          ) {

            return;
          }


          // =========================
          // CATEGORY ERROR
          // =========================

          if (
            result.type ===
            'category-error'
          ) {

            this.category = null;

            this.products = [];

            this.breadcrumb = [];

            this.categoryLoading =
              false;

            this.productsLoading =
              false;

            this.errorMessage =
              this.t('couldNotLoadCategory');

            this.cdr.detectChanges();

            return;
          }


          // =========================
          // NOT FOUND
          // =========================

          if (
            result.type ===
            'not-found'
          ) {

            this.category = null;

            this.products = [];

            this.breadcrumb = [];

            this.categoryLoading =
              false;

            this.productsLoading =
              false;

            this.errorMessage =
              this.t('categoryNotFound');

            this.cdr.detectChanges();

            return;
          }


          // =========================
          // CATEGORY WITH CHILDREN
          // =========================

          if (
            result.type ===
            'category'
          ) {

            this.category =
              result.category;

            this.breadcrumb =
              this.findCategoryPath(
                this.categoryTree,
                Number(result.category?.id)
              ) || [];

            this.products = [];

            this.categoryLoading =
              false;

            this.productsLoading =
              false;

            this.errorMessage = '';

            this.cdr.detectChanges();

            return;
          }


          // =========================
          // PRODUCTS
          // =========================

          if (
            result.type ===
            'products'
          ) {

            console.log(
              'CATEGORY PRODUCTS =',
              result.products
            );

            console.log(
  'PRODUCT IMAGE URLS =',
  result.products.map((p: any) => ({
    id: p.id,
    name: p.name,
    image: p.image,
    imageUrl: p.imageUrl
  }))
);

            this.category =
              result.category;

            this.breadcrumb =
              this.findCategoryPath(
                this.categoryTree,
                Number(result.category?.id)
              ) || [];

            this.products =
              Array.isArray(
                result.products
              )
                ? result.products
                : [];

            this.categoryLoading =
              false;

            this.productsLoading =
              false;

            this.errorMessage = '';

            this.cdr.detectChanges();

            return;
          }


          // =========================
          // PRODUCT ERROR
          // =========================

          if (
            result.type ===
            'product-error'
          ) {

            this.category =
              result.category;

            this.breadcrumb =
              this.findCategoryPath(
                this.categoryTree,
                Number(result.category?.id)
              ) || [];

            this.products = [];

            this.categoryLoading =
              false;

            this.productsLoading =
              false;

            this.errorMessage =
              this.t('couldNotLoadProducts');

            this.cdr.detectChanges();

            return;
          }

        });
      });
  }


  // =========================
  // FIND CATEGORY
  // =========================

  findCategory(
    categories: any[],
    id: number
  ): any {

    if (
      !Array.isArray(categories)
    ) {

      return null;
    }

    for (
      const cat of categories
    ) {

      if (
        Number(cat?.id) ===
        Number(id)
      ) {

        return cat;
      }


      const children =
        Array.isArray(
          cat?.children
        )
          ? cat.children
          : [];


      if (
        children.length > 0
      ) {

        const found =
          this.findCategory(
            children,
            id
          );

        if (found) {

          return found;
        }
      }
    }

    return null;
  }


  // =========================
  // FIND CATEGORY PATH (ব্রেডক্রাম্বের জন্য)
  // =========================

  findCategoryPath(
    categories: any[],
    id: number,
    path: any[] = []
  ): any[] | null {

    if (
      !Array.isArray(categories)
    ) {

      return null;
    }

    for (
      const cat of categories
    ) {

      const nextPath =
        [...path, cat];

      if (
        Number(cat?.id) ===
        Number(id)
      ) {

        return nextPath;
      }

      const children =
        Array.isArray(
          cat?.children
        )
          ? cat.children
          : [];

      if (
        children.length > 0
      ) {

        const found =
          this.findCategoryPath(
            children,
            id,
            nextPath
          );

        if (found) {

          return found;
        }
      }
    }

    return null;
  }


  // =========================
  // DISCOUNTED PRICE (rounded, for card display)
  // =========================

  getFinalPrice(p: any): number {

    const price = Number(p?.price) || 0;
    const discount = Number(p?.discount) || 0;

    if (!discount) {
      return price;
    }

    return Math.round(price - (price * discount / 100));
  }


  // =========================
  // GET CART QTY
  // =========================

  getCartQty(
    product: any
  ): number {

    const found =
      this.cart
        .getItems()
        .find(
          (item: any) =>
            Number(item.id) ===
            Number(product.id)
        );

    return found
      ? Number(found.qty)
      : 0;
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
    product.stock <= 0
  ) {
    return;
  }

  this.cart.add({
    ...product,
    price: this.getFinalPrice(product)
  });


}

  // =========================
  // INCREASE QTY
  // =========================

  increaseQty(
    product: any,
    event?: Event
  ): void {

    event?.stopPropagation();

    const found =
      this.cart
        .getItems()
        .find(
          (item: any) =>
            Number(item.id) ===
            Number(product.id)
        );


    if (!found) {

      this.cart.add({
        ...product,
        price: this.getFinalPrice(product)
      });

      this.cdr.detectChanges();

      return;
    }


    if (
      Number(product?.stock) > 0 &&
      Number(found.qty) >=
      Number(product.stock)
    ) {

      return;
    }


    this.cart.increase(found);

    this.cdr.detectChanges();
  }


  // =========================
  // DECREASE QTY
  // =========================

  decreaseQty(
    product: any,
    event?: Event
  ): void {

    event?.stopPropagation();

    const found =
      this.cart
        .getItems()
        .find(
          (item: any) =>
            Number(item.id) ===
            Number(product.id)
        );


    if (!found) {

      return;
    }


    if (
      Number(found.qty) <= 1
    ) {

      this.cart.remove(found);

      this.cdr.detectChanges();

      return;
    }


    this.cart.decrease(found);

    this.cdr.detectChanges();
  }


  // =========================
  // OPEN CATEGORY
  // =========================

  openCategory(
    cat: any
  ): void {

    const id =
      Number(cat?.id);

    if (!id) {

      return;
    }

    // একই category হলে কিছু না
    if (
      id ===
      Number(this.categoryId)
    ) {

      return;
    }

    this.router.navigate([
      '/category',
      id
    ]);
  }


  // =========================
  // SIDEBAR CLICK
  // =========================

  onSidebarCategory(
    data: any
  ): void {

    if (!data) {

      return;
    }


    if (
      data.level === 'close'
    ) {

      return;
    }


    if (
      data.level === 'all' ||
      Number(data.id) === 0
    ) {

      this.router.navigate(['/']);

      return;
    }


    const id =
      Number(data.id);


    if (!id) {

      return;
    }


    // একই route হলে duplicate navigate না
    if (
      id ===
      Number(this.categoryId)
    ) {

      return;
    }


    this.router.navigate([
      '/category',
      id
    ]);
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


    return `${this.apiUrl}/images/${url}`;
  }


  // =========================
  // PRODUCT IMAGE
  // =========================

  getProductImage(
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


    return `${this.apiUrl}/images/${url}`;
  }


  // =========================
  // IMAGE ERROR
  // =========================

  onImgError(
    event: Event
  ): void {

    const img =
      event.target as HTMLImageElement;


    if (
      img.src.includes(
        'no-image.png'
      )
    ) {

      return;
    }


    img.src =
      'assets/no-image.png';
  }


  // =========================
  // TRACK PRODUCT
  // =========================

trackByProduct(
  index: number,
  product: any
): any {

  return product?.id ?? index;
}


// =========================
// OPEN PRODUCT
// =========================

openProduct(
  id: number
): void {

  if (!id) {
    return;
  }

  this.router.navigate([
    '/product',
    id
  ]);

}


// =========================
// DESTROY
// =========================

ngOnDestroy(): void {

  this.destroy$.next();

  this.destroy$.complete();
}
}