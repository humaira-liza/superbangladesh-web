import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css'
})
export class AdminCategories implements OnInit {

  categories: any[] = [];

  form = {
    name: '',
    parentId: null
  };

  api =
    'https://superbangladesh-api-1.onrender.com/api/categories';

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.load();
  }

 load() {

  this.http
    .get<any[]>(this.api)
    .subscribe({

      next: (res) => {

        console.log('CATEGORIES = ', res);

        this.categories = res || [];
      },

      error: (err) => {

        console.log('ERROR = ', err);
      }

    });
}

  save() {

    const data = {

      name: this.form.name,

      parent: this.form.parentId
        ? { id: this.form.parentId }
        : null
    };

    this.http
      .post(this.api, data)
      .subscribe(() => {

        alert('Category Added');

        this.form = {
          name: '',
          parentId: null
        };

        this.load();
      });
  }
}