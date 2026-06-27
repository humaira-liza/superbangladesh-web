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

        // MAIN CATEGORY
        this.mainCategories = [...this.categories];

        // SUB CATEGORY LIST
        this.subCategories = [];

        this.mainCategories.forEach(main => {

          if (main.children?.length) {

            main.children.forEach((sub: any) => {

              this.subCategories.push(sub);

            });

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

    let type = 'MAIN';

    if (c.parent && c.parent.parent) {

      type = 'CHILD';

    } else if (c.parent) {

      type = 'SUB';
    }

    this.form = {

      name: c.name,

      type: type,

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