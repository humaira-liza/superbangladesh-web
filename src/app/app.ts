import {
  Component,
  OnInit,
  OnDestroy,
  NgZone
} from '@angular/core';

import {
  RouterOutlet
} from '@angular/router';

import {
  CommonModule
} from '@angular/common';

import {
  Navbar
} from './components/navbar/navbar';

import {
  CartDrawer
} from './components/cart-drawer/cart-drawer';


@Component({
  selector: 'app-root',

  standalone: true,

  imports: [
    RouterOutlet,
    Navbar,
    CommonModule,
    CartDrawer
  ],

  templateUrl: './app.html',

  styleUrls: ['./app.scss']
})
export class AppComponent
  implements OnInit, OnDestroy {

  cartDrawerOpen = false;


  private openCartHandler =
    () => {

      this.zone.run(() => {

        this.openCartDrawer();

      });
    };


  constructor(
    private zone: NgZone
  ) {}


  ngOnInit(): void {

    window.addEventListener(
      'open-cart-drawer',
      this.openCartHandler
    );
  }


  ngOnDestroy(): void {

    window.removeEventListener(
      'open-cart-drawer',
      this.openCartHandler
    );

    document.body.classList.remove(
      'cart-drawer-open'
    );
  }


  openCartDrawer(): void {

  console.log('OPEN CART DRAWER');

  console.trace();

  this.cartDrawerOpen = true;

  document.body.classList.add('cart-open');

}

  closeCartDrawer(): void {

  this.cartDrawerOpen = false;

  document.body.classList.remove('cart-open');

  document.body.classList.remove('cart-drawer-open');

}
}