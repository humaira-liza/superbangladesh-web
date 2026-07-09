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
  selector: 'app-admin-features',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './admin-features.html',

  styleUrls: [
    './admin-features.css'
  ]
})
export class AdminFeatures
  implements OnInit {

  features: any[] = [];

  loading = false;

  saving = false;

  editingId: number | null = null;

  togglingId: number | null = null;


  readonly api =
    'https://superbangladesh-api-1.onrender.com/api/homepage-features';


  form = {

    icon: '',

    title: '',

    description: '',

    active: true,

    displayOrder: 1

  };


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
      .get<any[]>(this.api)
      .pipe(

        finalize(() => {

          this.loading = false;

        })

      )
      .subscribe({

        next: (res: any[]) => {

          this.features =
            Array.isArray(res)
              ? res
              : [];
        },


        error: (err: any) => {

          console.error(
            'Features load failed',
            err
          );

          this.features = [];
        }

      });
  }


  // =========================
  // SAVE
  // =========================

  save(): void {

    if (this.saving) {
      return;
    }


    const icon =
      String(
        this.form.icon || ''
      ).trim();


    const title =
      String(
        this.form.title || ''
      ).trim();


    const description =
      String(
        this.form.description || ''
      ).trim();


    if (!icon) {

      alert(
        'Icon is required'
      );

      return;
    }


    if (!title) {

      alert(
        'Title is required'
      );

      return;
    }


    if (!description) {

      alert(
        'Description is required'
      );

      return;
    }


    const order =
      Number(
        this.form.displayOrder
      );


    const payload = {

      icon,

      title,

      description,

      active:
        Boolean(
          this.form.active
        ),

      displayOrder:
        Number.isFinite(order)
          ? Math.max(
              0,
              Math.floor(order)
            )
          : 0

    };


    this.saving = true;


    // UPDATE

    if (
      this.editingId !== null
    ) {

      this.http
        .put(
          `${this.api}/${this.editingId}`,
          payload
        )
        .pipe(

          finalize(() => {

            this.saving = false;

          })

        )
        .subscribe({

          next: () => {

            alert(
              'Feature Updated'
            );

            this.reset();
          },


          error: (err: any) => {

            console.error(
              'Feature update failed',
              err
            );

            alert(
              'Feature update failed'
            );
          }

        });


      return;
    }


    // CREATE

    this.http
      .post(
        this.api,
        payload
      )
      .pipe(

        finalize(() => {

          this.saving = false;

        })

      )
      .subscribe({

        next: () => {

          alert(
            'Feature Added'
          );

          this.reset();
        },


        error: (err: any) => {

          console.error(
            'Feature add failed',
            err
          );

          alert(
            'Feature add failed'
          );
        }

      });
  }


  // =========================
  // EDIT
  // =========================

  edit(feature: any): void {

    this.editingId =
      Number(feature.id);


    this.form = {

      icon:
        feature.icon || '',

      title:
        feature.title || '',

      description:
        feature.description || '',

      active:
        Boolean(feature.active),

      displayOrder:
        Number(
          feature.displayOrder
        ) || 0

    };


    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });
  }


  // =========================
  // TOGGLE
  // =========================

  toggle(feature: any): void {

    if (
      this.togglingId !== null
    ) {
      return;
    }


    this.togglingId =
      Number(feature.id);


    this.http
      .put(
        `${this.api}/${feature.id}/toggle`,
        null
      )
      .pipe(

        finalize(() => {

          this.togglingId = null;

        })

      )
      .subscribe({

        next: () => {

          this.load();
        },


        error: (err: any) => {

          console.error(
            'Feature toggle failed',
            err
          );

          alert(
            'Feature status update failed'
          );
        }

      });
  }


  // =========================
  // DELETE
  // =========================

  delete(id: number): void {

    if (
      !confirm(
        'Delete this feature?'
      )
    ) {
      return;
    }


    this.http
      .delete(
        `${this.api}/${id}`
      )
      .subscribe({

        next: () => {

          alert(
            'Feature Deleted'
          );

          this.load();
        },


        error: (err: any) => {

          console.error(
            'Feature delete failed',
            err
          );

          alert(
            'Feature delete failed'
          );
        }

      });
  }


  // =========================
  // RESET
  // =========================

  reset(): void {

    this.editingId = null;


    this.form = {

      icon: '',

      title: '',

      description: '',

      active: true,

      displayOrder:
        this.getNextOrder()

    };


    this.load();
  }


  // =========================
  // NEXT ORDER
  // =========================

  private getNextOrder(): number {

    if (!this.features.length) {
      return 1;
    }


    const orders =
      this.features.map(
        (feature: any) =>
          Number(
            feature.displayOrder
          ) || 0
      );


    return (
      Math.max(...orders) + 1
    );
  }
}