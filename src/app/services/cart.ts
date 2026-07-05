import {
  Injectable
} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  items: any[] = [];


  // =========================
  // ADD
  // =========================

  add(
    product: any
  ): void {

    if (!product?.id) {
      return;
    }

    const found =
      this.items.find(
        p =>
          Number(p.id) ===
          Number(product.id)
      );

    if (found) {

      const stock =
        Number(
          found.stock ??
          product.stock ??
          999999
        );

      if (
        Number(found.qty) <
        stock
      ) {

        found.qty =
          Number(found.qty) + 1;
      }

      return;
    }

    this.items.push({

      ...product,

      qty: 1
    });
  }


  // =========================
  // INCREASE CART ITEM
  // =========================

  increase(
    product: any
  ): void {

    if (!product) {
      return;
    }

    const stock =
      Number(
        product.stock ??
        999999
      );

    if (
      Number(product.qty) <
      stock
    ) {

      product.qty =
        Number(product.qty) + 1;
    }
  }


  // =========================
  // DECREASE CART ITEM
  // =========================

  decrease(
    product: any
  ): void {

    if (!product) {
      return;
    }

    if (
      Number(product.qty) > 1
    ) {

      product.qty =
        Number(product.qty) - 1;

    } else {

      this.remove(product);
    }
  }


  // =========================
  // INCREASE BY PRODUCT
  // =========================

  increaseByProduct(
    product: any
  ): void {

    if (!product?.id) {
      return;
    }

    const found =
      this.items.find(
        item =>
          Number(item.id) ===
          Number(product.id)
      );

    if (!found) {

      this.add(product);

      return;
    }

    this.increase(found);
  }


  // =========================
  // DECREASE BY PRODUCT
  // =========================

  decreaseByProduct(
    product: any
  ): void {

    if (!product?.id) {
      return;
    }

    const found =
      this.items.find(
        item =>
          Number(item.id) ===
          Number(product.id)
      );

    if (!found) {
      return;
    }

    if (
      Number(found.qty) <= 1
    ) {

      this.remove(found);

      return;
    }

    found.qty =
      Number(found.qty) - 1;
  }


  // =========================
  // GET PRODUCT QTY
  // =========================

  getQty(
    productId: any
  ): number {

    const found =
      this.items.find(
        item =>
          Number(item.id) ===
          Number(productId)
      );

    return found
      ? Number(found.qty) || 0
      : 0;
  }


  // =========================
  // CHECK PRODUCT
  // =========================

  has(
    productId: any
  ): boolean {

    return this.getQty(
      productId
    ) > 0;
  }


  // =========================
  // REMOVE
  // =========================

  remove(
    product: any
  ): void {

    if (!product?.id) {
      return;
    }

    this.items =
      this.items.filter(
        p =>
          Number(p.id) !==
          Number(product.id)
      );
  }


  // =========================
  // CLEAR
  // =========================

  clear(): void {

    this.items = [];
  }


  // =========================
  // GET ITEMS
  // =========================

  getItems(): any[] {

    return this.items;
  }


  // =========================
  // TOTAL
  // =========================

  getTotal(): number {

    return this.items.reduce(
      (
        total,
        p
      ) => {

        return total +
          (
            Number(p.price) *
            Number(p.qty)
          );

      },
      0
    );
  }


  // =========================
  // COUNT
  // =========================

  count(): number {

    return this.items.reduce(
      (
        total,
        item
      ) => {

        return total +
          Number(item.qty || 0);

      },
      0
    );
  }
}