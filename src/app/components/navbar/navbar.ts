import {
  Component,
  HostListener
} from '@angular/core';

import {
  Router,
  RouterModule
} from '@angular/router';

import {
  FormsModule
} from '@angular/forms';

import {
  CommonModule
} from '@angular/common';

import {
  Sidebar
} from '../sidebar/sidebar';

import {
  CartService
} from '../../services/cart';

import {
  ProductStateService
} from '../../services/product-state.service';


@Component({
  selector: 'app-navbar',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    Sidebar
  ],

  templateUrl: './navbar.html',

  styleUrls: [
    './navbar.scss'
  ]
})
export class Navbar {


  /* =========================
     SEARCH
  ========================= */

  searchText = '';


  /* =========================
     LOCATION
  ========================= */

  selectedLocation =
    localStorage.getItem('selectedLocation')
    || 'Dhaka';

  showLocationMenu = false;


  /* =========================
     LANGUAGE
  ========================= */

  selectedLanguage =
    localStorage.getItem('language')
    || 'en';


  /* =========================
     CHAT
  ========================= */

  showChat = false;


  /* =========================
     MOBILE CATEGORY SIDEBAR
  ========================= */

  sidebarOpen = false;


  /* =========================
     DESKTOP 3-DASH MENU
  ========================= */

  desktopMenuOpen = false;


  /* =========================
     CONSTRUCTOR
  ========================= */

  constructor(
    public cart: CartService,
    private router: Router,
    private state: ProductStateService
  ) {}


  /* =========================
     AUTH
  ========================= */

  isLoggedIn(): boolean {

    const token =
      localStorage.getItem('token');

    return !!token;
  }


  isAdmin(): boolean {

    const role =
      localStorage.getItem('role');

    return (
      role?.toLowerCase() === 'admin'
    );
  }


  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem(
      'userEmail'
    );

    localStorage.removeItem('role');

    this.desktopMenuOpen = false;

    this.sidebarOpen = false;

    this.router.navigate([
      '/login'
    ]);
  }


  /* =========================
     LANGUAGE CHANGE
  ========================= */

  changeLanguage(
    language: 'en' | 'bn'
  ): void {

    this.selectedLanguage =
      language;

    localStorage.setItem(
      'language',
      language
    );
  }


  /* =========================
     HOME
  ========================= */

  goHome(): void {

    this.searchText = '';

    this.state.setSearch('');

    this.state.setCategory(0);

    this.showLocationMenu = false;

    this.desktopMenuOpen = false;

    this.sidebarOpen = false;

    this.router.navigate([
      '/'
    ]);
  }


  /* =========================
     SEARCH
  ========================= */

  search(): void {

    const value =
      this.searchText.trim();

    /*
      Search text state-এ পাঠাবে।
      এখানে category reset করছি না।
    */

    this.state.setSearch(value);


    /*
      যদি Home page-এ না থাকি,
      শুধু তখন Home page-এ যাবে।
    */

    if (
      this.router.url.split('?')[0] !== '/'
    ) {

      this.router.navigate([
        '/'
      ]);
    }
  }


  /* =========================
     CLEAR SEARCH
  ========================= */

  clearSearch(): void {

    this.searchText = '';

    this.state.setSearch('');


    /*
      অন্য page-এ থাকলে
      Home page-এ যাবে
    */

    if (
      this.router.url.split('?')[0] !== '/'
    ) {

      this.router.navigate([
        '/'
      ]);
    }
  }


  /* =========================
     LOCATION
  ========================= */

  toggleLocationMenu(
    event?: MouseEvent
  ): void {

    if (event) {
      event.stopPropagation();
    }

    this.desktopMenuOpen = false;

    this.showLocationMenu =
      !this.showLocationMenu;
  }


  selectLocation(
    location: string
  ): void {

    this.selectedLocation =
      location;

    this.showLocationMenu =
      false;

    localStorage.setItem(
      'selectedLocation',
      location
    );
  }


  /* =========================
     DESKTOP 3-DASH MENU
  ========================= */

  toggleDesktopMenu(
    event: MouseEvent
  ): void {

    event.stopPropagation();

    this.showLocationMenu = false;

    this.desktopMenuOpen =
      !this.desktopMenuOpen;
  }


  closeDesktopMenu(): void {

    this.desktopMenuOpen = false;
  }


  /* =========================
     DOCUMENT CLICK
  ========================= */

  @HostListener(
    'document:click'
  )
  closeMenus(): void {

    this.showLocationMenu = false;

    this.desktopMenuOpen = false;
  }


  /* =========================
     CHAT
  ========================= */

  toggleChat(): void {

    this.showChat =
      !this.showChat;
  }


  /* =========================
     MOBILE SIDEBAR
  ========================= */

  toggleSidebar(): void {

    this.sidebarOpen =
      !this.sidebarOpen;
  }


  /* =========================
     MOBILE CATEGORY
  ========================= */

  onMobileCategory(
    data: any
  ): void {

    this.sidebarOpen = false;

    if (
      data?.level === 'close'
    ) {
      return;
    }

    if (!data) {
      return;
    }

    /*
      Category click করলে
      search clear হবে
    */

    this.searchText = '';

    this.state.setSearch('');

    this.state.setCategory(
      data.id
    );

    this.router.navigate([
      '/'
    ]);
  }


  /* =========================
     CART DRAWER
  ========================= */

  openCartDrawer(): void {

    window.dispatchEvent(

      new CustomEvent(
        'open-cart-drawer'
      )

    );
  }

}