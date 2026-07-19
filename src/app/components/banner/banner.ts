import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ProductStateService } from '../../services/product-state.service';

import { Subscription } from 'rxjs';


@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [
  CommonModule,
  FormsModule
],
  templateUrl: './banner.html',
  styleUrls: ['./banner.css']
})
export class Banner implements OnInit, OnDestroy {

  images: string[] = [];

  current = 0;
  intervalId: any;
  showMobileSearch = false;

searchText = '';

private sub?: Subscription;

applySearch(): void {

  this.state.setSearch(this.searchText);

}

clearSearch(): void {

  this.searchText = '';

  this.state.setSearch('');

}

  api =
    'https://superbangladesh-api-1.onrender.com/api/banners';

 constructor(
  private http: HttpClient,
  private cdr: ChangeDetectorRef,
  private state: ProductStateService
) {}
  ngOnInit() {

    this.sub = this.state.mobileSearch$
.subscribe(value => {

  this.showMobileSearch = value;

});

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

  this.sub?.unsubscribe();
}

  prev() {

    if (!this.images.length) return;

    this.current =
      (this.current - 1 + this.images.length)
      % this.images.length;

    
  }

  next() {

    if (!this.images.length) return;

    this.current =
      (this.current + 1)
      % this.images.length;

 
  }
}