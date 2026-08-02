import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { LanguageService } from '../../services/language.service';
import { AutoTranslateService } from '../../services/auto-translate.service';

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

  searchText = '';

get filteredProducts() {

  if (!this.searchText?.trim()) {
    return this.products;
  }

  const q = this.searchText.toLowerCase();

  return this.products.filter((p: any) =>
    p.name?.toLowerCase().includes(q) ||
    p.nameBn?.toLowerCase().includes(q) ||
    p.sku?.toLowerCase().includes(q) ||
    p.brand?.toLowerCase().includes(q)
  );
}

  loading = true;

 form: any = {

  name: '',
  nameBn: '',
  price: '',
  categoryId: null,

  // PRODUCT SIZE
  unit: '',
  quantity: '',

  // STOCK
  stock: '',
  stockUnit: '',

  // PRODUCT DETAILS
  description: '',
  descriptionBn: '',
  brand: '',
  origin: '',
  discount: 0,

  imageUrl: '',
  imageUrl2: '',
  imageUrl3: '',
  imageUrl4: ''

};

  editingId: number | null = null;

  selectedFile: File | null = null;
  selectedFile2: File | null = null;
selectedFile3: File | null = null;
selectedFile4: File | null = null;

  previewUrl: any = null;

  constructor(
    private ps: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    public languageService: LanguageService,
    private autoTranslate: AutoTranslateService
  ) {}

  translatingName = false;

  // ✅ ইংরেজি নাম লেখার পর বাংলা ফাঁকা থাকলে অটো ট্রান্সলেট করে
  autoFillNameBn(): void {

    if (!this.form.name?.trim()) return;
    if (this.form.nameBn?.trim()) return;

    this.translatingName = true;

    this.autoTranslate
      .translate(this.form.name, 'bn')
      .subscribe(bn => {

        this.translatingName = false;

        if (bn) {
          this.form.nameBn = bn;
        }
      });
  }

  // ✅ বাংলা নাম লেখার পর ইংরেজি ফাঁকা থাকলে অটো ট্রান্সলেট করে
  autoFillNameEn(): void {

    if (!this.form.nameBn?.trim()) return;
    if (this.form.name?.trim()) return;

    this.translatingName = true;

    this.autoTranslate
      .translate(this.form.nameBn, 'en')
      .subscribe(en => {

        this.translatingName = false;

        if (en) {
          this.form.name = en;
        }
      });
  }

  translatingDescription = false;

  // ✅ ইংরেজি description লেখার পর বাংলা ফাঁকা থাকলে অটো ট্রান্সলেট করে
  autoFillDescriptionBn(): void {

    if (!this.form.description?.trim()) return;
    if (this.form.descriptionBn?.trim()) return;

    this.translatingDescription = true;

    this.autoTranslate
      .translate(this.form.description, 'bn')
      .subscribe(bn => {

        this.translatingDescription = false;

        if (bn) {
          this.form.descriptionBn = bn;
        }
      });
  }

  // ✅ বাংলা description লেখার পর ইংরেজি ফাঁকা থাকলে অটো ট্রান্সলেট করে
  autoFillDescriptionEn(): void {

    if (!this.form.descriptionBn?.trim()) return;
    if (this.form.description?.trim()) return;

    this.translatingDescription = true;

    this.autoTranslate
      .translate(this.form.descriptionBn, 'en')
      .subscribe(en => {

        this.translatingDescription = false;

        if (en) {
          this.form.description = en;
        }
      });
  }

  ngOnInit() {

    this.load();

    this.loadCategories();
  }

  // TRANSLATE HELPER (admin panel লেবেলের জন্য)
  t(key: string): string {
    return this.languageService.translate(key);
  }

  // LOAD PRODUCTS
  load() {

  this.loading = true;

  this.ps.getProducts().subscribe({

    next: (res: any[]) => {

      console.log("ALL PRODUCTS =", res);

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

  // DISCOUNTED PRICE (rounded, for card display)
  getFinalPrice(p: any) {

    const price = Number(p?.price) || 0;
    const discount = Number(p?.discount) || 0;

    if (!discount) {
      return price;
    }

    return Math.round(price - (price * discount / 100));
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

  onFile2Change(event: any) {
  this.selectedFile2 = event.target.files[0];
}

onFile3Change(event: any) {
  this.selectedFile3 = event.target.files[0];
}

onFile4Change(event: any) {
  this.selectedFile4 = event.target.files[0];
}

 // CATEGORY FOLDER
getCategoryFolder(id: number) {

  const format = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  for (const main of this.categories) {

    if (main.id === id) {
      return format(main.name);
    }

    for (const sub of main.children || []) {

      if (sub.id === id) {
        return format(main.name);
      }

      for (const child of sub.children || []) {

        if (child.id === id) {
          return format(main.name);
        }
      }
    }
  }

  return "general";
}

upload(file: File | null, folder: string): Promise<string> {

  if (!file) {
    return Promise.resolve('');
  }

  return new Promise((resolve, reject) => {

    this.ps.uploadImage(file, folder).subscribe({

      next: (url: string) => resolve(url),

      error: (err) => reject(err)

    });

  });

}
  // SAVE PRODUCT
  save() {
    const folder = this.getCategoryFolder(
  Number(this.form.categoryId)
);

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

    if (this.editingId !== null) {

     const updateData: any = {

  name: this.form.name,

  nameBn: this.form.nameBn || '',

  price: Number(this.form.price),

  stock: Number(this.form.stock),

  quantity: this.form.quantity
    ? Number(this.form.quantity)
    : 0,

  unit: this.form.unit || '',

  stockUnit: this.form.stockUnit,

  description: this.form.description,

  descriptionBn: this.form.descriptionBn || '',

  brand: this.form.brand,

  origin: this.form.origin,

  discount: Number(this.form.discount) || 0,

  imageUrl: this.form.imageUrl,

  imageUrl2: this.form.imageUrl2,

  imageUrl3: this.form.imageUrl3,

  imageUrl4: this.form.imageUrl4,

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

    console.log("TYPE =", typeof imageUrl);
    console.log("VALUE =", imageUrl);
    console.log("JSON =", JSON.stringify(imageUrl));

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

   (async () => {

  try {

    const imageUrl = await this.upload(this.selectedFile, folder);

    const imageUrl2 = await this.upload(this.selectedFile2, folder);

    const imageUrl3 = await this.upload(this.selectedFile3, folder);

    const imageUrl4 = await this.upload(this.selectedFile4, folder);

    const data = {

      name: this.form.name,

      nameBn: this.form.nameBn || '',

      price: Number(this.form.price),

      stock: Number(this.form.stock),

      quantity: this.form.quantity
        ? Number(this.form.quantity)
        : 0,

      unit: this.form.unit || '',

      stockUnit: this.form.stockUnit,

      description: this.form.description,

      descriptionBn: this.form.descriptionBn || '',

      brand: this.form.brand,

      origin: this.form.origin,

      // sku পাঠানো হচ্ছে না — Save করলে backend থেকেই
      // Auto Generate হবে (SB000001, SB000002, ...)

      discount: Number(this.form.discount) || 0,

      imageUrl: imageUrl,

      imageUrl2: imageUrl2,

      imageUrl3: imageUrl3,

      imageUrl4: imageUrl4,

      category: {
        id: Number(this.form.categoryId)
      }

    };

    this.ps.addProduct(data).subscribe({

      next: () => {

        alert('✅ Product Added');

        this.reset();

        this.load();

      },

      error: (err) => {

        console.log(err);

        alert('❌ Product Add Failed');

      }

    });

  } catch (err) {

    console.log(err);

    alert('❌ Image Upload Failed');

  }

})();
  }

  // FINAL UPDATE
 finalUpdate(data: any) {

  console.log("Editing ID =", this.editingId);
  console.log("Update Data =", data);

  this.ps
    .updateProduct(this.editingId!, data)
    .subscribe({

      next: () => {

        alert('✅ Updated');

        this.reset();

        this.load();
      },

      error: (err) => {

        console.log("FULL ERROR =", err);

        alert('❌ Update failed');
      }
    });
}

  // EDIT
  edit(p: any) {

  console.log("EDIT PRODUCT =", p);
  console.log("FORM IMAGE =", p.imageUrl);

 this.form = {

  name: p.name,
  nameBn: p.nameBn || '',
  price: p.price,
  categoryId: p.category?.id || null,

  unit: p.unit || '',
  quantity: p.quantity || '',

  stock: p.stock || '',
  stockUnit: p.stockUnit || '',

  description: p.description || '',
  descriptionBn: p.descriptionBn || '',

  brand: p.brand || '',

  origin: p.origin || '',

  discount: p.discount || 0,

  imageUrl: p.imageUrl || '',

  imageUrl2: p.imageUrl2 || '',

  imageUrl3: p.imageUrl3 || '',

  imageUrl4: p.imageUrl4 || ''

};

  this.previewUrl = this.getImage(p.imageUrl);

this.selectedFile = null;
this.selectedFile2 = null;
this.selectedFile3 = null;
this.selectedFile4 = null;

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
  nameBn: '',
  price: '',

  categoryId: null,

  unit: '',
  quantity: '',

  stock: '',
  stockUnit: '',

  description: '',
  descriptionBn: '',

  brand: '',

  origin: '',

  discount: 0,

  imageUrl: '',

  imageUrl2: '',

  imageUrl3: '',

  imageUrl4: ''

};

  this.editingId = null;

this.selectedFile = null;
this.selectedFile2 = null;
this.selectedFile3 = null;
this.selectedFile4 = null;

this.previewUrl = null;
  }
}