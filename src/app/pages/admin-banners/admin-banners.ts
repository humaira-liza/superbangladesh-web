import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-banners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-banners.html'
})
export class AdminBanners
implements OnInit {

  banners: any[] = [];
  file: File | null = null;

  api =
    'https://superbangladesh-api-1.onrender.com/api/banners';

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {

    this.http.get<any[]>(this.api)
      .subscribe(res => {

        this.banners = res;
      });
  }

  select(event: any) {

    this.file =
      event.target.files[0];
  }

  save() {

    if (!this.file) return;

    const fd = new FormData();

    fd.append(
      'file',
      this.file
    );

    this.http.post(
      this.api,
      fd
    ).subscribe(() => {

      alert('Banner Added');

      this.load();
    });
  }

  delete(id: number) {

    if (!confirm('Delete?')) return;

    this.http.delete(
      `${this.api}/${id}`
    ).subscribe(() => {

      this.load();
    });
  }
}