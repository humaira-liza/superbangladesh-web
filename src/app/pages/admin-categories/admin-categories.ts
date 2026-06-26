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

  editingId: number | null = null;

  selectedFile: File | null = null;

  form = {
    name: '',
    parentId: null as number | null
  };

  loadApi =
    'https://superbangladesh-api-1.onrender.com/api/categories/tree';

  saveApi =
    'https://superbangladesh-api-1.onrender.com/api/categories';

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {

    this.http
      .get<any[]>(this.loadApi)
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

  onFileSelected(event: any) {

    if (event.target.files.length > 0) {

      this.selectedFile =
        event.target.files[0];
    }
  }

  save() {

    const formData = new FormData();

    formData.append(
      'name',
      this.form.name
    );

    if (this.form.parentId) {

      formData.append(
        'parentId',
        String(this.form.parentId)
      );
    }

    if (this.selectedFile) {

      formData.append(
        'file',
        this.selectedFile
      );
    }

    // UPDATE

    if (this.editingId) {

      this.http
        .put(
          `${this.saveApi}/${this.editingId}`,
          formData
        )
        .subscribe(() => {

          alert('Category Updated');

          this.reset();
        });

      return;
    }

    // ADD

    this.http
      .post(this.saveApi, formData)
      .subscribe({

        next: () => {

          alert('Category Added');

          this.reset();
        },

        error: (err) => {

          console.log(err);
        }

      });
  }

  edit(c: any) {

    this.editingId = c.id;

    this.form = {

      name: c.name,

      parentId:
        c.parent?.id || null
    };
  }

  delete(id: number) {

    if (!confirm('Delete Category?')) {
      return;
    }

    this.http
      .delete(
        `${this.saveApi}/${id}`
      )
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

      parentId: null
    };

    this.load();
  }
}