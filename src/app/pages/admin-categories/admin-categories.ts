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
  mainCategories: any[] = [];
  subCategories: any[] = [];

  editingId: number | null = null;
  selectedFile: File | null = null;

  form = {
    name: '',
    type: 'MAIN',
    parentId: null as number | null
  };

  api =
    'https://superbangladesh-api-1.onrender.com/api/categories';

  imageBase =
    'https://superbangladesh-api-1.onrender.com';

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {

    this.http
      .get<any[]>(`${this.api}/tree`)
      .subscribe(res => {

        this.categories = res || [];

        // Main Category
        this.mainCategories = res || [];

        // Sub Category
        this.subCategories = [];

        this.mainCategories.forEach(m => {

          if (m.children) {

            this.subCategories.push(
              ...m.children
            );
          }

        });

      });
  }

  onFileSelected(event: any) {

    if (event.target.files.length > 0) {

      this.selectedFile =
        event.target.files[0];
    }
  }

  save() {

    const fd = new FormData();

    fd.append(
      'name',
      this.form.name
    );

    if (this.form.parentId) {

      fd.append(
        'parentId',
        String(this.form.parentId)
      );
    }

    if (this.selectedFile) {

      fd.append(
        'file',
        this.selectedFile
      );
    }

    // UPDATE

    if (this.editingId) {

      this.http.put(
        `${this.api}/${this.editingId}`,
        fd
      ).subscribe(() => {

        alert('Category Updated');

        this.reset();

      });

      return;
    }

    // ADD

    this.http.post(
      this.api,
      fd
    ).subscribe(() => {

      alert('Category Added');

      this.reset();

    });

  }

  edit(c: any) {

    this.editingId = c.id;

    this.form = {

      name: c.name,

      type: c.parent
        ? 'SUB'
        : 'MAIN',

      parentId:
        c.parent?.id || null
    };
  }

  delete(id: number) {

    if (!confirm('Delete Category?')) {
      return;
    }

    this.http
      .delete(`${this.api}/${id}`)
      .subscribe(() => {

        alert('Deleted');

        this.load();
      });
  }

  reset() {

    this.editingId = null;

    this.selectedFile = null;

    this.form = {

      name: '',

      type: 'MAIN',

      parentId: null
    };

    this.load();
  }
}