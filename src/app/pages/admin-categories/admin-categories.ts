import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  HttpClient
} from '@angular/common/http';

import {
  finalize
} from 'rxjs/operators';


@Component({
  selector: 'app-admin-categories',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './admin-categories.html',

  styleUrl: './admin-categories.css'
})
export class AdminCategories
  implements OnInit {

  // =========================
  // CATEGORY DATA
  // =========================

  categories: any[] = [];

  mainCategories: any[] = [];

  subCategories: any[] = [];

  allCategories: any[] = [];


  // =========================
  // EDIT CONTROL
  // =========================

  editingId: number | null = null;

  selectedFile: File | null = null;

  previewImage: string | null = null;


  // =========================
  // LOADING CONTROL
  // =========================

  loading = false;

  saving = false;

  popularSavingId: number | null = null;


  // =========================
  // FORM
  // =========================

  form = {

    name: '',

    type: 'MAIN',

    parentId: null as number | null
  };


  // =========================
  // API
  // =========================

  readonly api =
    'https://superbangladesh-api-1.onrender.com/api/categories';

  readonly backendBase =
    'https://superbangladesh-api-1.onrender.com';


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.load();
  }


  // =========================
  // LOAD CATEGORY TREE
  // =========================

  load(): void {

    // IMPORTANT:
    // পুরনো "if (this.loading) return"
    // বাদ দেওয়া হয়েছে

    this.loading = true;

    this.cdr.detectChanges();


    this.http
      .get<any[]>(
        `${this.api}/tree`
      )
      .subscribe({

        next: (res: any[]) => {

          const data =
            Array.isArray(res)
              ? res
              : [];


          const categories: any[] = [];

          const mainCategories: any[] = [];

          const subCategories: any[] = [];

          const allCategories: any[] = [];


          // =========================
          // BUILD ALL ARRAYS
          // =========================

          for (const main of data) {

            this.normalizeCategory(main);

            main.children =
              Array.isArray(main?.children)
                ? main.children
                : [];


            categories.push(main);

            mainCategories.push(main);

            allCategories.push(main);


            // =========================
            // SUB CATEGORIES
            // =========================

            for (const sub of main.children) {

              this.normalizeCategory(sub);

              sub.children =
                Array.isArray(sub?.children)
                  ? sub.children
                  : [];


              subCategories.push(sub);

              allCategories.push(sub);


              // =========================
              // CHILD CATEGORIES
              // =========================

              for (const child of sub.children) {

                this.normalizeCategory(child);

                child.children =
                  Array.isArray(child?.children)
                    ? child.children
                    : [];


                allCategories.push(child);
              }
            }
          }


          // =========================
          // SORT POPULAR FIRST
          // =========================

          allCategories.sort(
            (a: any, b: any) => {

              const aPopular =
                Boolean(a?.popular);

              const bPopular =
                Boolean(b?.popular);


              if (
                aPopular &&
                !bPopular
              ) {

                return -1;
              }


              if (
                !aPopular &&
                bPopular
              ) {

                return 1;
              }


              if (
                aPopular &&
                bPopular
              ) {

                const aOrder =
                  Number(
                    a?.popularOrder
                  ) || 0;

                const bOrder =
                  Number(
                    b?.popularOrder
                  ) || 0;


                if (
                  aOrder !== bOrder
                ) {

                  return (
                    aOrder - bOrder
                  );
                }
              }


              return (
                Number(a?.id || 0) -
                Number(b?.id || 0)
              );
            }
          );


          // =========================
          // NEW ARRAY REFERENCES
          // =========================

          this.categories = [
            ...categories
          ];

          this.mainCategories = [
            ...mainCategories
          ];

          this.subCategories = [
            ...subCategories
          ];

          this.allCategories = [
            ...allCategories
          ];


          // =========================
          // STOP LOADING
          // =========================

          this.loading = false;


          // =========================
          // FORCE UI UPDATE
          // =========================

          this.cdr.detectChanges();


          console.log(
            'CATEGORY UI UPDATED',
            {
              categories:
                this.categories.length,

              mainCategories:
                this.mainCategories.length,

              subCategories:
                this.subCategories.length,

              allCategories:
                this.allCategories.length,

              loading:
                this.loading
            }
          );
        },


        error: (err: any) => {

          console.error(
            'Category tree load failed',
            err
          );


          this.categories = [];

          this.mainCategories = [];

          this.subCategories = [];

          this.allCategories = [];


          this.loading = false;


          // FORCE ERROR UI UPDATE

          this.cdr.detectChanges();


          alert(
            this.getErrorMessage(
              err,
              'Categories could not be loaded'
            )
          );
        }

      });
  }


  // =========================
  // NORMALIZE CATEGORY
  // =========================

  private normalizeCategory(
    category: any
  ): void {

    if (!category) {

      return;
    }


    category.popular =
      Boolean(
        category.popular
      );


    const order =
      Number(
        category.popularOrder
      );


    category.popularOrder =
      Number.isFinite(order)
        ? order
        : 0;
  }


  // =========================
  // SORT POPULAR FIRST
  // =========================

  sortPopularCategories(): void {

    const sorted = [
      ...this.allCategories
    ];


    sorted.sort(
      (a: any, b: any) => {

        const aPopular =
          Boolean(a?.popular);

        const bPopular =
          Boolean(b?.popular);


        if (
          aPopular &&
          !bPopular
        ) {

          return -1;
        }


        if (
          !aPopular &&
          bPopular
        ) {

          return 1;
        }


        if (
          aPopular &&
          bPopular
        ) {

          const aOrder =
            Number(
              a?.popularOrder
            ) || 0;

          const bOrder =
            Number(
              b?.popularOrder
            ) || 0;


          if (
            aOrder !== bOrder
          ) {

            return (
              aOrder - bOrder
            );
          }
        }


        return (
          Number(a?.id || 0) -
          Number(b?.id || 0)
        );
      }
    );


    this.allCategories = sorted;


    this.cdr.detectChanges();
  }


  // =========================
  // IMAGE URL FIX
  // CLOUDINARY + LOCAL IMAGE
  // =========================

  getImageUrl(
    imageUrl: string | null | undefined
  ): string {

    if (!imageUrl) {

      return '';
    }


    const url =
      String(imageUrl).trim();


    if (!url) {

      return '';
    }


    // CLOUDINARY OR FULL URL

    if (
      url.startsWith('https://') ||
      url.startsWith('http://')
    ) {

      return url;
    }


    // PROTOCOL RELATIVE

    if (
      url.startsWith('//')
    ) {

      return `https:${url}`;
    }


    // BACKEND RELATIVE URL

    if (
      url.startsWith('/')
    ) {

      return (
        this.backendBase +
        url
      );
    }


    // SIMPLE RELATIVE PATH

    return (
      this.backendBase +
      '/' +
      url
    );
  }


  // =========================
  // IMAGE ERROR
  // =========================

  onImageError(
    event: Event
  ): void {

    const img =
      event.target as HTMLImageElement;


    if (!img) {

      return;
    }


    img.style.display =
      'none';
  }


  // =========================
  // SELECT IMAGE
  // =========================

  onFileSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    const file =
      input.files?.[0];


    if (!file) {

      return;
    }


    this.selectedFile = file;


    const reader =
      new FileReader();


    reader.onload = () => {

      this.previewImage =
        reader.result as string;


      this.cdr.detectChanges();
    };


    reader.readAsDataURL(file);
  }


  // =========================
  // SAVE CATEGORY
  // =========================

  save(): void {

    if (this.saving) {

      return;
    }


    const cleanName =
      String(
        this.form.name || ''
      ).trim();


    if (!cleanName) {

      alert(
        'Category name is required'
      );

      return;
    }


    if (
      this.form.type !== 'MAIN' &&
      !this.form.parentId
    ) {

      alert(
        'Please select parent category'
      );

      return;
    }


    const fd =
      new FormData();


    fd.append(
      'name',
      cleanName
    );


    if (
      this.form.type !== 'MAIN' &&
      this.form.parentId !== null
    ) {

      fd.append(
        'parentId',
        String(
          this.form.parentId
        )
      );
    }


    if (this.selectedFile) {

      fd.append(
        'file',
        this.selectedFile
      );
    }


    this.saving = true;

    this.cdr.detectChanges();


    // =========================
    // UPDATE CATEGORY
    // =========================

    if (
      this.editingId !== null
    ) {

      this.http
        .put<any>(
          `${this.api}/${this.editingId}`,
          fd
        )
        .pipe(

          finalize(() => {

            this.saving = false;

            this.cdr.detectChanges();
          })

        )
        .subscribe({

          next: () => {

            alert(
              'Category Updated'
            );

            this.reset();
          },


          error: (err: any) => {

            console.error(
              'Category update failed',
              err
            );


            alert(
              this.getErrorMessage(
                err,
                'Category update failed'
              )
            );
          }

        });


      return;
    }


    // =========================
    // ADD CATEGORY
    // =========================

    this.http
      .post<any>(
        this.api,
        fd
      )
      .pipe(

        finalize(() => {

          this.saving = false;

          this.cdr.detectChanges();
        })

      )
      .subscribe({

        next: () => {

          alert(
            'Category Added'
          );

          this.reset();
        },


        error: (err: any) => {

          console.error(
            'Category add failed',
            err
          );


          alert(
            this.getErrorMessage(
              err,
              'Category add failed'
            )
          );
        }

      });
  }


  // =========================
  // EDIT CATEGORY
  // =========================

  edit(c: any): void {

    if (!c) {

      return;
    }


    this.editingId =
      Number(c.id);


    let type = 'MAIN';


    if (
      c.parent &&
      c.parent.parent
    ) {

      type = 'CHILD';

    } else if (c.parent) {

      type = 'SUB';
    }


    this.form = {

      name:
        c.name || '',

      type,

      parentId:
        c.parent?.id || null
    };


    this.previewImage =
      this.getImageUrl(
        c.imageUrl
      );


    this.selectedFile = null;


    this.cdr.detectChanges();


    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });
  }


  // =========================
  // DELETE CATEGORY
  // =========================

  delete(id: number): void {

    if (
      !confirm(
        'Delete Category?'
      )
    ) {

      return;
    }


    this.http
      .delete(
        `${this.api}/${id}`,
        {
          responseType: 'text'
        }
      )
      .subscribe({

        next: () => {

          alert(
            'Deleted'
          );

          this.load();
        },


        error: (err: any) => {

          console.error(
            'Category delete failed',
            err
          );


          alert(
            this.getErrorMessage(
              err,
              'Cannot delete category'
            )
          );
        }

      });
  }


  // =========================
  // TOGGLE POPULAR
  // =========================

  togglePopular(
    category: any
  ): void {

    if (!category) {

      return;
    }


    if (
      this.popularSavingId !== null
    ) {

      return;
    }


    const newPopular =
      !Boolean(
        category.popular
      );


    let newOrder = 0;


    if (newPopular) {

      const currentOrder =
        Number(
          category.popularOrder
        );


      newOrder =
        Number.isFinite(
          currentOrder
        ) &&
        currentOrder > 0

          ? Math.floor(
              currentOrder
            )

          : this.getNextPopularOrder();
    }


    this.updatePopular(
      category,
      newPopular,
      newOrder
    );
  }


  // =========================
  // SAVE POPULAR ORDER
  // =========================

  savePopularOrder(
    category: any
  ): void {

    if (!category) {

      return;
    }


    if (
      !Boolean(
        category.popular
      )
    ) {

      alert(
        'First enable this category as Popular'
      );

      return;
    }


    if (
      this.popularSavingId !== null
    ) {

      return;
    }


    let order =
      Number(
        category.popularOrder
      );


    if (
      !Number.isFinite(order) ||
      order < 1
    ) {

      order = 1;
    }


    order =
      Math.floor(order);


    category.popularOrder =
      order;


    this.updatePopular(
      category,
      true,
      order
    );
  }


  // =========================
  // UPDATE POPULAR
  // =========================

  private updatePopular(
    category: any,
    popular: boolean,
    popularOrder: number
  ): void {

    this.popularSavingId =
      Number(
        category.id
      );


    this.cdr.detectChanges();


    const safeOrder =
      Number.isFinite(
        Number(popularOrder)
      )

        ? Math.max(
            0,
            Math.floor(
              Number(popularOrder)
            )
          )

        : 0;


    const url =
      `${this.api}/${category.id}/popular` +
      `?popular=${encodeURIComponent(
        String(popular)
      )}` +
      `&order=${encodeURIComponent(
        String(safeOrder)
      )}`;


    this.http
      .put<any>(
        url,
        null
      )
      .pipe(

        finalize(() => {

          this.popularSavingId = null;

          this.cdr.detectChanges();
        })

      )
      .subscribe({

        next: (updated: any) => {

          category.popular =
            updated?.popular ??
            popular;


          category.popularOrder =
            updated?.popularOrder ??
            safeOrder;


          // NEW ARRAY REFERENCE

          this.allCategories = [
            ...this.allCategories
          ];


          // FORCE IMMEDIATE UI UPDATE

          this.cdr.detectChanges();


          // RELOAD FRESH SERVER DATA

          this.load();
        },


        error: (err: any) => {

          console.error(
            'Popular category update failed',
            err
          );


          alert(
            this.getErrorMessage(
              err,
              'Popular category update failed'
            )
          );


          this.load();
        }

      });
  }


  // =========================
  // NEXT POPULAR ORDER
  // =========================

  private getNextPopularOrder(): number {

    const orders =
      this.allCategories

        .filter(
          (c: any) =>
            Boolean(
              c?.popular
            )
        )

        .map(
          (c: any) =>
            Number(
              c?.popularOrder
            ) || 0
        )

        .filter(
          (order: number) =>
            order > 0
        );


    if (!orders.length) {

      return 1;
    }


    return (
      Math.max(...orders) + 1
    );
  }


  // =========================
  // ERROR MESSAGE
  // =========================

  private getErrorMessage(
    err: any,
    fallback: string
  ): string {

    if (
      typeof err?.error === 'string' &&
      err.error.trim()
    ) {

      return err.error;
    }


    if (
      typeof err?.error?.message === 'string' &&
      err.error.message.trim()
    ) {

      return err.error.message;
    }


    if (
      typeof err?.message === 'string' &&
      err.message.trim()
    ) {

      return err.message;
    }


    return fallback;
  }


  // =========================
  // RESET FORM
  // =========================

  reset(): void {

    this.editingId = null;

    this.selectedFile = null;

    this.previewImage = null;


    this.form = {

      name: '',

      type: 'MAIN',

      parentId: null
    };


    this.cdr.detectChanges();


    this.load();
  }
}