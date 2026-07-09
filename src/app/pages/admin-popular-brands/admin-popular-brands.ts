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
  selector:
    'app-admin-popular-brands',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './admin-popular-brands.html',

  styleUrls: [
    './admin-popular-brands.css'
  ]
})
export class AdminPopularBrands
  implements OnInit {


  items: any[] = [];


  loading = false;

  saving = false;


  editingId:
    number | null = null;


  selectedFile:
    File | null = null;


  previewImage:
    string | null = null;


  activeSavingId:
    number | null = null;


  orderSavingId:
    number | null = null;


  deletingId:
    number | null = null;


  form = {

    name: '',

    displayOrder: 0,

    active: true
  };


  readonly api =
    'https://superbangladesh-api-1.onrender.com/api/popular-brands';


  constructor(
    private http: HttpClient
  ) {}


  ngOnInit(): void {

    this.load();
  }


  // =========================
  // LOAD
  // =========================

  load(): void {

    if (this.loading) {
      return;
    }


    this.loading = true;


    this.http
      .get<any[]>(
        this.api
      )
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

        },


        error: (err: any) => {

          console.error(
            'Popular brands load failed',
            err
          );


          this.items = [];


          alert(
            this.getErrorMessage(
              err,
              'Popular brands could not be loaded'
            )
          );
        }

      });
  }


  // =========================
  // FILE
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


    this.selectedFile =
      file;


    const reader =
      new FileReader();


    reader.onload = () => {

      this.previewImage =
        reader.result as string;
    };


    reader.readAsDataURL(
      file
    );
  }


  // =========================
  // SAVE
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
        'Brand name is required'
      );

      return;
    }


    const fd =
      new FormData();


    fd.append(
      'name',
      cleanName
    );


    fd.append(
      'displayOrder',
      String(
        Math.max(
          0,
          Math.floor(
            Number(
              this.form.displayOrder
            ) || 0
          )
        )
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


    const request$ =
      this.editingId !== null

        ? this.http.put<any>(
            `${this.api}/${this.editingId}`,
            fd
          )

        : this.http.post<any>(
            this.api,
            fd
          );


    request$
      .pipe(

        finalize(() => {

          this.saving = false;

        })

      )
      .subscribe({

        next: () => {

          alert(
            this.editingId !== null
              ? 'Brand Updated'
              : 'Brand Added'
          );


          this.reset();
        },


        error: (err: any) => {

          console.error(
            'Brand save failed',
            err
          );


          alert(
            this.getErrorMessage(
              err,
              'Brand save failed'
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

      name:
        item.name || '',

      displayOrder:
        Number(
          item.displayOrder
        ) || 0,

      active:
        Boolean(
          item.active
        )
    };


    this.previewImage =
      item.imageUrl || null;


    this.selectedFile =
      null;


    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });
  }


  // =========================
  // ACTIVE
  // =========================

  toggleActive(
    item: any
  ): void {

    if (
      !item ||
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


    this.http
      .put<any>(
        `${this.api}/${item.id}/active` +
        `?active=${encodeURIComponent(
          String(newActive)
        )}`,
        null
      )
      .pipe(

        finalize(() => {

          this.activeSavingId =
            null;

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
              'Active update failed'
            )
          );


          this.load();
        }

      });
  }


  // =========================
  // ORDER
  // =========================

  saveOrder(
    item: any
  ): void {

    if (
      !item ||
      this.orderSavingId !== null
    ) {
      return;
    }


    const order =
      Math.max(
        0,
        Math.floor(
          Number(
            item.displayOrder
          ) || 0
        )
      );


    item.displayOrder =
      order;


    this.orderSavingId =
      Number(item.id);


    this.http
      .put<any>(
        `${this.api}/${item.id}/order` +
        `?order=${encodeURIComponent(
          String(order)
        )}`,
        null
      )
      .pipe(

        finalize(() => {

          this.orderSavingId =
            null;

        })

      )
      .subscribe({

        next: () => {

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
              'Order update failed'
            )
          );
        }

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
        'Delete this brand?'
      )
    ) {
      return;
    }


    this.deletingId =
      Number(id);


    this.http
      .delete(
        `${this.api}/${id}`,
        {
          responseType: 'text'
        }
      )
      .pipe(

        finalize(() => {

          this.deletingId =
            null;

        })

      )
      .subscribe({

        next: () => {

          alert(
            'Brand Deleted'
          );


          this.load();
        },


        error: (err: any) => {

          console.error(
            'Brand delete failed',
            err
          );


          alert(
            this.getErrorMessage(
              err,
              'Brand delete failed'
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

    this.editingId =
      null;


    this.selectedFile =
      null;


    this.previewImage =
      null;


    this.form = {

      name: '',

      displayOrder: 0,

      active: true
    };


    this.load();
  }


  // =========================
  // ERROR
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


    return fallback;
  }
}