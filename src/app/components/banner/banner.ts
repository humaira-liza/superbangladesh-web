import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.html',
  styleUrls: ['./banner.css']
})
export class Banner implements OnInit, OnDestroy {

  images: string[] = [];

  current = 0;
  intervalId: any;

  api =
    'https://superbangladesh-api-1.onrender.com/api/banners';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.http
      .get<any[]>(this.api)
      .subscribe({

        next: (res) => {

          this.images =
            (res || []).map(
              b => b.imageUrl
            );

          if (this.images.length > 1) {

            this.intervalId =
              setInterval(() => {

                this.current =
                  (this.current + 1)
                  % this.images.length;

                this.cdr.detectChanges();

              }, 3000);
          }
        },

        error: err => {
          console.log(err);
        }

      });
  }

  ngOnDestroy() {

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  prev() {

    if (!this.images.length) return;

    this.current =
      (this.current - 1 + this.images.length)
      % this.images.length;

    this.cdr.detectChanges();
  }

  next() {

    if (!this.images.length) return;

    this.current =
      (this.current + 1)
      % this.images.length;

    this.cdr.detectChanges();
  }
}