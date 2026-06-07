import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.html',
  styleUrls: ['./admin-products.css']
})
export class AdminProducts implements OnInit {

  products: any[] = [];
  categories: any[] = [];

  loading = true;

  form: any = {

    name: '',
    price: '',
    categoryId: null,

    // PRODUCT SIZE
    unit: '',
    quantity: '',

    // STOCK
    stock: '',
    stockUnit: '',

    imageUrl: ''
  };

  editingId: number | null = null;

  selectedFile: File | null = null;

  previewUrl: any = null;

  constructor(
    private ps: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.load();

    this.loadCategories();
  }

  // LOAD PRODUCTS
  load() {

    this.loading = true;

    this.ps.getProducts().subscribe({

      next: (res: any[]) => {

        this.products = res || [];

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: () => {

        this.loading = false;
      }
    });
  }

  // LOAD CATEGORY TREE
  loadCategories() {

    this.categoryService
      .getTree()
      .subscribe({

        next: (res: any[]) => {

          this.categories = res || [];
        },

        error: () => {

          this.categories = [];
        }
      });
  }

  // IMAGE URL

getImage(url: string) {

  if (!url || url === 'null') {

    return 'assets/no-image.png';
  }

  
  if (url.startsWith('http')) {

    return url;
  }

  // BACKEND SERVER
  return `https://superbangladesh-api-1.onrender.com/images/${url}`;
}

  // FILE CHANGE
  onFileChange(event: any) {

    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {

      const reader = new FileReader();

      reader.onload = () => {

        this.previewUrl = reader.result;
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }

  // CATEGORY FOLDER
  getCategoryFolder(id: number) {

    for (let main of this.categories) {

      // MAIN
      if (main.id === id) {

        return main.name
          .toLowerCase()
          .replace(/\s/g, '');
      }

      // SUB
      for (let sub of main.children || []) {

        if (sub.id === id) {

          return main.name
            .toLowerCase()
            .replace(/\s/g, '');
        }

        // CHILD
        for (let child of sub.children || []) {

          if (child.id === id) {

            return main.name
              .toLowerCase()
              .replace(/\s/g, '');
          }
        }
      }
    }

    return 'general';
  }

  // SAVE PRODUCT
  save() {

    // VALIDATION
    if (
      !this.form.name ||
      this.form.price === '' ||
      this.form.stock === '' ||
      !this.form.stockUnit
    ) {

      alert('Fill all fields ❌');

      return;
    }

    if (!this.form.categoryId) {

      alert('Select category ❌');

      return;
    }

    // =====================
    // UPDATE PRODUCT
    // =====================

    if (this.editingId) {

      const updateData: any = {

        name: this.form.name,

        price: Number(this.form.price),

        stock: Number(this.form.stock),

        // PRODUCT SIZE
        quantity: this.form.quantity
          ? Number(this.form.quantity)
          : 0,

        unit: this.form.unit || '',

        // IMPORTANT
        stockUnit: this.form.stockUnit,

        imageUrl: this.form.imageUrl,

        category: {
          id: Number(this.form.categoryId)
        }
      };

      // IMAGE UPDATE
      if (this.selectedFile) {

        const folder = this.getCategoryFolder(
          Number(this.form.categoryId)
        );

        this.ps
          .uploadImage(this.selectedFile, folder)
          .subscribe({

            next: (imageUrl: any) => {

              updateData.imageUrl = imageUrl;

              this.finalUpdate(updateData);
            },

            error: (err) => {

  console.log('FULL ERROR = ', err);

  alert(
    'STATUS = ' + err.status +
    '\n\nMESSAGE = ' + err.message +
    '\n\nERROR = ' +
    JSON.stringify(err.error)
  );
}
          });

      } else {

        this.finalUpdate(updateData);
      }

      return;
    }

    // =====================
    // ADD PRODUCT
    // =====================

    if (!this.selectedFile) {

      alert('Select image ❌');

      return;
    }

    const folder = this.getCategoryFolder(
      Number(this.form.categoryId)
    );

    this.ps
      .uploadImage(this.selectedFile, folder)
      .subscribe({

        next: (imageUrl: any) => {

          const data = {

            name: this.form.name,

            price: Number(this.form.price),

            stock: Number(this.form.stock),

            quantity: this.form.quantity
              ? Number(this.form.quantity)
              : 0,

            unit: this.form.unit || '',

            // IMPORTANT
            stockUnit: this.form.stockUnit,

            imageUrl: imageUrl,

            category: {
              id: Number(this.form.categoryId)
            }
          };

          this.ps
            .addProduct(data)
            .subscribe({

              next: () => {

                alert('✅ Product Added');

                this.reset();

                this.load();
              },

              error: (err) => {

  console.log('FULL ERROR = ', err);

  alert(
    'STATUS = ' + err.status +
    '\n\nMESSAGE = ' + err.message +
    '\n\nERROR = ' +
    JSON.stringify(err.error)
  );
}
            });
        },

        error: (err) => {

          console.log(err);

          alert('❌ Image upload failed');
        }
      });
  }

  // FINAL UPDATE
  finalUpdate(data: any) {

    this.ps
      .updateProduct(this.editingId!, data)
      .subscribe({

        next: () => {

          alert('✅ Updated');

          this.reset();

          this.load();
        },

        error: (err) => {

          console.log(err);

          alert('❌ Update failed');
        }
      });
  }

  // EDIT
  edit(p: any) {

    this.form = {

      name: p.name,

      price: p.price,

      categoryId: p.category?.id || null,

      // PRODUCT SIZE
      unit: p.unit || '',

      quantity: p.quantity || '',

      // STOCK
      stock: p.stock || '',

      stockUnit: p.stockUnit || '',

      imageUrl: p.imageUrl || ''
    };

    this.previewUrl = this.getImage(p.imageUrl);

    this.selectedFile = null;

    this.editingId = p.id;
  }

  // DELETE
  delete(id: number) {

    if (!confirm('Delete product?')) {

      return;
    }

    this.ps
      .deleteProduct(id)
      .subscribe({

        next: () => {

          this.load();
        },

        error: (err) => {

          console.log(err);

          alert('❌ Delete failed');
        }
      });
  }

  // RESET
  reset() {

    this.form = {

      name: '',
      price: '',

      categoryId: null,

      unit: '',
      quantity: '',

      stock: '',
      stockUnit: '',

      imageUrl: ''
    };

    this.editingId = null;

    this.selectedFile = null;

    this.previewUrl = null;
  }
}