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

import {
  DomSanitizer,
  SafeHtml
} from '@angular/platform-browser';


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


  /* =========================
     ADMIN-MANAGED SIDEBAR LINKS
     (Offers, Rewards, Safety Center,
     Premium Care, Help, File a
     Complaint, Suppliers)
  ========================= */

  readonly sidebarLinksApi =
    'https://superbangladesh-api-1.onrender.com/api/sidebar-links/active';


  quickLinks: any[] = [];

  extraLinks: any[] = [];


  // ফিক্সড, প্রফেশনাল SVG আইকন সেট —
  // admin শুধু iconKey বেছে নেয়, raw emoji না
  private readonly iconLibrary:
    Record<string, string> = {

    gift:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8"/><path d="M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8"/></svg>',

    star:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',

    shield:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',

    award:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',

    phone:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',

    'alert-triangle':
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',

    truck:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',

    tag:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12.01V2h10.01l8.58 8.58a2 2 0 0 1 0 2.83z"/><circle cx="7" cy="7" r="1.5"/></svg>',

    heart:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',

    info:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };


  private readonly fallbackIcon =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg>';


  private readonly iconCache =
    new Map<string, SafeHtml>();


  constructor(
    private http: HttpClient,
    public router: Router,
    private cdr: ChangeDetectorRef,
    public languageService:
      LanguageService,
    private sanitizer: DomSanitizer
  ) {}


  /* =========================
     RESOLVE ICON SVG
  ========================= */

  getIcon(
    iconKey: string
  ): SafeHtml {

    const key =
      (iconKey || '')
        .trim()
        .toLowerCase();


    if (this.iconCache.has(key)) {
      return this.iconCache.get(key)!;
    }


    const raw =
      this.iconLibrary[key]
      || this.fallbackIcon;


    const safe =
      this.sanitizer
        .bypassSecurityTrustHtml(raw);


    this.iconCache.set(key, safe);

    return safe;
  }


  /* =========================
     LINK LABEL (BILINGUAL)
  ========================= */

  linkLabel(
    link: any
  ): string {

    return this.languageService.language() === 'bn'
      ? (link?.labelBn || link?.labelEn || '')
      : (link?.labelEn || link?.labelBn || '');
  }


  /* =========================
     LOAD SIDEBAR LINKS
  ========================= */

  loadSidebarLinks(): void {

    this.http
      .get<any[]>(this.sidebarLinksApi)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (res) => {

          const links =
            (Array.isArray(res) ? res : [])
              .filter(
                (l: any) =>
                  !l?.adminOnly || this.isAdmin
              );

          this.quickLinks =
            links.filter(
              (l: any) => l?.section === 'QUICK'
            );

          this.extraLinks =
            links.filter(
              (l: any) => l?.section !== 'QUICK'
            );

          this.cdr.detectChanges();
        },


        error: (err) => {

          console.error(
            'SIDEBAR LINKS ERROR =',
            err
          );

          this.quickLinks = [];
          this.extraLinks = [];
        }
      });
  }


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

    this.loadSidebarLinks();

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

const sortedCategories =
  this.normalizeCategories(
    Array.isArray(res)
      ? res
      : []
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

  const id = Number(cat.id);

  this.selectedId = id;
  this.expandedMain = id;
  this.expandedSub = null;

  this.router.navigate([
    '/category',
    id
  ]);

  this.categoryClick.emit({
    level: 'close'
  });

}

  /* =========================
     SUB CATEGORY
  ========================= */
onSub(
  sub: any,
  parent: any
): void {

  if (!sub?.id) {
    return;
  }

  const id = Number(sub.id);

  this.selectedId = id;
  this.expandedMain = Number(parent.id);

  this.expandedSub =
    sub.children?.length
      ? id
      : null;

  this.router.navigate([
    '/category',
    id
  ]);

  this.categoryClick.emit({
    level: 'close'
  });

}

  /* =========================
     CHILD CATEGORY
  ========================= */
onChild(
  child: any,
  sub: any,
  main: any
): void {

  if (!child?.id) {
    return;
  }

  const id = Number(child.id);

  this.selectedId = id;
  this.expandedMain = Number(main.id);
  this.expandedSub = Number(sub.id);

  this.router.navigate([
    '/category',
    id
  ]);

  this.categoryClick.emit({
    level: 'close'
  });

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