import {
  Component,
  OnInit
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
  selector: 'app-admin-shop-more',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './admin-shop-more.html',

  styleUrl: './admin-shop-more.css'
})
export class AdminShopMore
  implements OnInit {

  // =========================
  // DATA
  // =========================

  items: any[] = [];


  // =========================
  // CONTROL
  // =========================

  loading = false;

  saving = false;

  deletingId: number | null = null;

  activeSavingId: number | null = null;

  orderSavingId: number | null = null;

  editingId: number | null = null;


  // =========================
  // IMAGE
  // =========================

  selectedFile: File | null = null;

  previewImage: string | null = null;


  // =========================
  // FORM
  // =========================

  form = {

    title: '',

    description: '',

    badgeText: '',

    displayOrder: 0,

    active: true
  };


  // =========================
  // API
  // =========================

  readonly api =
    'https://superbangladesh-api-1.onrender.com/api/shop-more';


  constructor(
    private http: HttpClient
  ) {}


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.load();
  }


  // =========================
  // LOAD ALL
  // =========================

  load(): void {

    if (this.loading) {

      return;
    }


    this.loading = true;


    this.http
      .get<any[]>(this.api)
      .pipe(

        finalize(() => {

          this.loading = false;

        })

      )
      .subscribe({

        next: (res: any[]) => {

          this.items =
            Array.isArray(res)
              ? res
              : [];


          this.items.sort(
            (a: any, b: any) => {

              const aOrder =
                Number(
                  a?.displayOrder
                ) || 0;

              const bOrder =
                Number(
                  b?.displayOrder
                ) || 0;


              if (aOrder !== bOrder) {

                return aOrder - bOrder;
              }


              return (
                Number(a?.id || 0) -
                Number(b?.id || 0)
              );
            }
          );
        },


        error: (err: any) => {

          console.error(
            'Shop More load failed',
            err
          );


          this.items = [];


          alert(
            this.getErrorMessage(
              err,
              'Shop More items could not be loaded'
            )
          );
        }

      });
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


    if (
      !file.type.startsWith('image/')
    ) {

      alert(
        'Please select an image file'
      );

      input.value = '';

      return;
    }


    this.selectedFile = file;


    const reader =
      new FileReader();


    reader.onload = () => {

      this.previewImage =
        reader.result as string;
    };


    reader.readAsDataURL(file);
  }


  // =========================
  // SAVE
  // =========================

  save(): void {

    if (this.saving) {

      return;
    }


    const title =
      String(
        this.form.title || ''
      ).trim();


    if (!title) {

      alert(
        'Title is required'
      );

      return;
    }


    const fd =
      new FormData();


    fd.append(
      'title',
      title
    );


    fd.append(
      'description',
      String(
        this.form.description || ''
      ).trim()
    );


    fd.append(
      'badgeText',
      String(
        this.form.badgeText || ''
      ).trim()
    );


    fd.append(
      'displayOrder',
      String(
        Number(
          this.form.displayOrder
        ) || 0
      )
    );


    fd.append(
      'active',
      String(
        Boolean(
          this.form.active
        )
      )
    );


    if (this.selectedFile) {

      fd.append(
        'file',
        this.selectedFile
      );
    }


    this.saving = true;


    // =========================
    // UPDATE
    // =========================

    if (this.editingId !== null) {

      this.http
        .put<any>(
          `${this.api}/${this.editingId}`,
          fd
        )
        .pipe(

          finalize(() => {

            this.saving = false;

          })

        )
        .subscribe({

          next: () => {

            alert(
              'Shop More item updated'
            );


            this.reset();
          },


          error: (err: any) => {

            console.error(
              'Shop More update failed',
              err
            );


            alert(
              this.getErrorMessage(
                err,
                'Update failed'
              )
            );
          }

        });


      return;
    }


    // =========================
    // CREATE
    // =========================

    this.http
      .post<any>(
        this.api,
        fd
      )
      .pipe(

        finalize(() => {

          this.saving = false;

        })

      )
      .subscribe({

        next: () => {

          alert(
            'Shop More item added'
          );


          this.reset();
        },


        error: (err: any) => {

          console.error(
            'Shop More create failed',
            err
          );


          alert(
            this.getErrorMessage(
              err,
              'Create failed'
            )
          );
        }

      });
  }


  // =========================
  // EDIT
  // =========================

  edit(
    item: any
  ): void {

    if (!item) {

      return;
    }


    this.editingId =
      Number(item.id);


    this.form = {

      title:
        item.title || '',

      description:
        item.description || '',

      badgeText:
        item.badgeText || '',

      displayOrder:
        Number(
          item.displayOrder
        ) || 0,

      active:
        item.active !== false
    };


    this.previewImage =
      item.imageUrl || null;


    this.selectedFile = null;


    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });
  }


  // =========================
  // DELETE
  // =========================

  delete(
    id: number
  ): void {

    if (
      this.deletingId !== null
    ) {

      return;
    }


    if (
      !confirm(
        'Delete this Shop More item?'
      )
    ) {

      return;
    }


    this.deletingId = id;


    this.http
      .delete(
        `${this.api}/${id}`,
        {
          responseType: 'text'
        }
      )
      .pipe(

        finalize(() => {

          this.deletingId = null;

        })

      )
      .subscribe({

        next: () => {

          alert(
            'Item deleted'
          );


          this.load();
        },


        error: (err: any) => {

          console.error(
            'Shop More delete failed',
            err
          );


          alert(
            this.getErrorMessage(
              err,
              'Delete failed'
            )
          );
        }

      });
  }


  // =========================
  // TOGGLE ACTIVE
  // =========================

  toggleActive(
    item: any
  ): void {

    if (!item) {

      return;
    }


    if (
      this.activeSavingId !== null
    ) {

      return;
    }


    const newActive =
      !Boolean(
        item.active
      );


    this.activeSavingId =
      Number(item.id);


    const url =
      `${this.api}/${item.id}/active` +
      `?active=${encodeURIComponent(
        String(newActive)
      )}`;


    this.http
      .put<any>(
        url,
        null
      )
      .pipe(

        finalize(() => {

          this.activeSavingId = null;

        })

      )
      .subscribe({

        next: (updated: any) => {

          item.active =
            updated?.active ??
            newActive;
        },


        error: (err: any) => {

          console.error(
            'Active update failed',
            err
          );


          alert(
            this.getErrorMessage(
              err,
              'Active status update failed'
            )
          );


          this.load();
        }

      });
  }


  // =========================
  // SAVE ORDER
  // =========================

  saveOrder(
    item: any
  ): void {

    if (!item) {

      return;
    }


    if (
      this.orderSavingId !== null
    ) {

      return;
    }


    let order =
      Number(
        item.displayOrder
      );


    if (
      !Number.isFinite(order) ||
      order < 0
    ) {

      order = 0;
    }


    order =
      Math.floor(order);


    item.displayOrder =
      order;


    this.orderSavingId =
      Number(item.id);


    const url =
      `${this.api}/${item.id}/order` +
      `?order=${encodeURIComponent(
        String(order)
      )}`;


    this.http
      .put<any>(
        url,
        null
      )
      .pipe(

        finalize(() => {

          this.orderSavingId = null;

        })

      )
      .subscribe({

        next: (updated: any) => {

          item.displayOrder =
            updated?.displayOrder ??
            order;


          this.load();
        },


        error: (err: any) => {

          console.error(
            'Order update failed',
            err
          );


          alert(
            this.getErrorMessage(
              err,
              'Display order update failed'
            )
          );
        }

      });
  }


  // =========================
  // IMAGE ERROR
  // =========================

  onImageError(
    event: Event
  ): void {

    const img =
      event.target as HTMLImageElement;


    if (img) {

      img.style.display =
        'none';
    }
  }


  // =========================
  // RESET
  // =========================

  reset(): void {

    this.editingId = null;

    this.selectedFile = null;

    this.previewImage = null;


    this.form = {

      title: '',

      description: '',

      badgeText: '',

      displayOrder: 0,

      active: true
    };


    this.load();
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
}