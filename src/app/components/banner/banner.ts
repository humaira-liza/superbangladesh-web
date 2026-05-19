import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.html',
  styleUrls: ['./banner.css']
})
export class Banner implements OnInit, OnDestroy {

  images = [
    'banner/banner1.jpg',
    'banner/banner2.jpg',
    'banner/banner3.jpg'
  ];

  current = 0;
  intervalId: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.current = (this.current + 1) % this.images.length;

      // 🔥 FORCE UPDATE UI
      this.cdr.detectChanges();

    }, 3000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  prev() {
    this.current = (this.current - 1 + this.images.length) % this.images.length;
    this.cdr.detectChanges();
  }

  next() {
    this.current = (this.current + 1) % this.images.length;
    this.cdr.detectChanges();
  }
}