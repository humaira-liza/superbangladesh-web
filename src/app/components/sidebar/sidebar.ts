import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  HttpClient
} from '@angular/common/http';

import {
  Router,
  RouterModule,
  NavigationEnd
} from '@angular/router';

import {
  Subject,
  filter,
  takeUntil
} from 'rxjs';

import {
  LanguageService
} from '../../services/language.service';


@Component({
  selector: 'app-sidebar',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule
  ],

  templateUrl: './sidebar.html',

  styleUrls: [
    './sidebar.css'
  ]
})
export class Sidebar
  implements OnInit, OnDestroy {


  @Output()
  categoryClick =
    new EventEmitter<any>();


  categories: any[] = [];


  expandedMain:
    number | null = null;


  expandedSub:
    number | null = null;


  selectedId:
    number | null = null;


  private destroy$ =
    new Subject<void>();


  isAdmin =
    localStorage
      .getItem('role')
      ?.toLowerCase() ===
    'admin';


  constructor(
    private http: HttpClient,
    public router: Router,
    private cdr: ChangeDetectorRef,
    public languageService:
      LanguageService
  ) {}


  /* =========================
     TRANSLATE FIXED TEXT
  ========================= */

  t(
    key: string
  ): string {

    return this.languageService
      .translate(key);
  }


  /* =========================
     TRANSLATE CATEGORY
  ========================= */

  categoryName(
    category: any
  ): string {

    return this.languageService
      .translateCategory(
        category?.name
      );
  }


  /* =========================
     INIT
  ========================= */

  ngOnInit(): void {

    this.loadCategories();

    this.router.events
      .pipe(

        filter(
          event =>
            event instanceof
            NavigationEnd
        ),

        takeUntil(
          this.destroy$
        )
      )
      .subscribe(() => {

        this.restoreSidebarFromUrl();
      });
  }


  /* =========================
     LOAD CATEGORY TREE
  ========================= */

  loadCategories(): void {

    this.http
      .get<any[]>(
        'https://superbangladesh-api-1.onrender.com/api/categories/tree'
      )
      .pipe(
        takeUntil(
          this.destroy$
        )
      )
      .subscribe({

        next: (res) => {

          const order = [
            'Food',
            'Baby Care',
            'Home & Kitchen',
            'Health & Wellness',
            'Stationery & Office',
            'Toys & Sports',
            'Beauty & MakeUp'
          ];


          const normalized =
            this.normalizeCategories(
              Array.isArray(res)
                ? res
                : []
            );


          const sortedCategories =
            normalized.sort(
              (
                a: any,
                b: any
              ) => {

                const ai =
                  order.indexOf(
                    a.name
                  );

                const bi =
                  order.indexOf(
                    b.name
                  );

                return (
                  (
                    ai === -1
                      ? 999
                      : ai
                  )
                  -
                  (
                    bi === -1
                      ? 999
                      : bi
                  )
                );
              }
            );


          setTimeout(() => {

            this.categories =
              sortedCategories;

            console.log(
              'CATEGORY TREE =',
              this.categories
            );

            this.restoreSidebarFromUrl();

            this.cdr.detectChanges();

          }, 0);
        },


        error: (err) => {

          console.error(
            'CATEGORY TREE ERROR =',
            err
          );

          setTimeout(() => {

            this.categories = [];

            this.cdr.detectChanges();

          }, 0);
        }
      });
  }


  /* =========================
     NORMALIZE CATEGORY TREE
  ========================= */

  normalizeCategories(
    categories: any[]
  ): any[] {

    return categories.map(
      (cat: any) => {

        const children =
          Array.isArray(
            cat?.children
          )
            ? cat.children
            : [];

        return {

          ...cat,

          id:
            Number(cat.id),

          children:
            this.normalizeCategories(
              children
            )
        };
      }
    );
  }


  /* =========================
     RESTORE FROM URL
  ========================= */

  restoreSidebarFromUrl(): void {

    if (
      !Array.isArray(
        this.categories
      )
      ||
      this.categories.length === 0
    ) {
      return;
    }


    const url =
      this.router.url
        .split('?')[0];


    console.log(
      'SIDEBAR URL =',
      url
    );


    const match =
      url.match(
        /^\/category\/(\d+)$/
      );


    if (!match) {

      this.selectedId = null;

      this.expandedMain = null;

      this.expandedSub = null;

      return;
    }


    const currentId =
      Number(match[1]);


    const path =
      this.findCategoryPath(
        this.categories,
        currentId
      );


    console.log(
      'CATEGORY PATH =',
      path
    );


    if (path.length === 0) {

      this.selectedId = null;

      this.expandedMain = null;

      this.expandedSub = null;

      return;
    }


    this.selectedId =
      Number(
        path[
          path.length - 1
        ].id
      );


    this.expandedMain =
      Number(
        path[0].id
      );


    if (
      path.length === 1
    ) {

      this.expandedSub = null;

      return;
    }


    if (
      path.length === 2
    ) {

      const sub =
        path[1];


      const children =
        Array.isArray(
          sub?.children
        )
          ? sub.children
          : [];


      this.expandedSub =
        children.length > 0
          ? Number(sub.id)
          : null;

      return;
    }


    this.expandedSub =
      Number(
        path[1].id
      );
  }


  /* =========================
     FIND CATEGORY PATH
  ========================= */

  findCategoryPath(
    categories: any[],
    targetId: number,
    currentPath: any[] = []
  ): any[] {

    for (
      const cat of categories
    ) {

      const newPath = [
        ...currentPath,
        cat
      ];


      if (
        Number(cat?.id) ===
        Number(targetId)
      ) {
        return newPath;
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
            targetId,
            newPath
          );


        if (
          found.length > 0
        ) {
          return found;
        }
      }
    }


    return [];
  }


  /* =========================
     MAIN CATEGORY
  ========================= */

  onMain(
    cat: any
  ): void {

    if (!cat?.id) {
      return;
    }


    const id =
      Number(cat.id);


    this.selectedId =
      id;


    this.expandedMain =
      id;


    this.expandedSub =
      null;


    this.router.navigate([
      '/category',
      id
    ]);
  }


  /* =========================
     SUB CATEGORY
  ========================= */

  onSub(
    sub: any,
    parent: any
  ): void {

    if (
      !sub?.id ||
      !parent?.id
    ) {
      return;
    }


    const subId =
      Number(sub.id);


    const parentId =
      Number(parent.id);


    this.selectedId =
      subId;


    this.expandedMain =
      parentId;


    const children =
      Array.isArray(
        sub?.children
      )
        ? sub.children
        : [];


    this.expandedSub =
      children.length > 0
        ? subId
        : null;


    this.router.navigate([
      '/category',
      subId
    ]);
  }


  /* =========================
     CHILD CATEGORY
  ========================= */

  onChild(
    child: any,
    sub: any,
    main: any
  ): void {

    if (
      !child?.id ||
      !sub?.id ||
      !main?.id
    ) {
      return;
    }


    const childId =
      Number(child.id);


    this.selectedId =
      childId;


    this.expandedMain =
      Number(main.id);


    this.expandedSub =
      Number(sub.id);


    this.router.navigate([
      '/category',
      childId
    ]);
  }


  /* =========================
     HANDLE MAIN
  ========================= */

  handleMain(
    cat: any,
    event: Event
  ): void {

    event.preventDefault();

    event.stopPropagation();

    this.onMain(cat);
  }


  /* =========================
     HANDLE SUB
  ========================= */

  handleSub(
    sub: any,
    parent: any,
    event: Event
  ): void {

    event.preventDefault();

    event.stopPropagation();

    this.onSub(
      sub,
      parent
    );
  }


  /* =========================
     HANDLE CHILD
  ========================= */

  handleChild(
    child: any,
    sub: any,
    main: any,
    event: Event
  ): void {

    event.preventDefault();

    event.stopPropagation();

    this.onChild(
      child,
      sub,
      main
    );
  }


  /* =========================
     CLOSE SIDEBAR
  ========================= */

  closeSidebar(): void {

    this.categoryClick.emit({
      level: 'close'
    });
  }


  /* =========================
     CATEGORY ICON
  ========================= */

  getCategoryIcon(
    name: string
  ): string {

    const icons:
      Record<string, string> = {

      'Food':
        '🛍️',

      'Baby Care':
        '🧴',

      'Home & Kitchen':
        '🛋️',

      'Health & Wellness':
        '⚕️',

      'Stationery & Office':
        '📚',

      'Toys & Sports':
        '🧸',

      'Beauty & MakeUp':
        '💄'
    };


    return (
      icons[name]
      || '📦'
    );
  }


  /* =========================
     DESTROY
  ========================= */

  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();
  }

}