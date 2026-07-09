import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  HttpClient
} from '@angular/common/http';


@Component({
  selector: 'app-features',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './features.html',

  styleUrls: [
    './features.css'
  ]
})
export class Features
  implements OnInit {

  features: any[] = [];

  loading = true;


  readonly api =
    'https://superbangladesh-api-1.onrender.com/api/homepage-features/active';


  constructor(
    private http: HttpClient
  ) {}


  ngOnInit(): void {

    this.loadFeatures();
  }


  loadFeatures(): void {

    this.loading = true;


    this.http
      .get<any[]>(this.api)
      .subscribe({

        next: (res: any[]) => {

          this.features =
            Array.isArray(res)
              ? res
              : [];

          this.loading = false;
        },


        error: (err: any) => {

          console.error(
            'Homepage features load failed',
            err
          );

          this.features = [];

          this.loading = false;
        }

      });
  }
}