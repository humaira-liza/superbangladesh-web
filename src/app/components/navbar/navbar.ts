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

import {
  AppLanguage,
  LanguageService
} from '../../services/language.service';


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
    localStorage.getItem(
      'selectedLocation'
    ) || 'Dhaka';

  showLocationMenu = false;


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
    private state: ProductStateService,
    public languageService: LanguageService
  ) {}


  /* =========================
     CURRENT LANGUAGE
  ========================= */

  get selectedLanguage():
    AppLanguage {

    return this.languageService
      .language();
  }


  /* =========================
     TRANSLATE
  ========================= */

  t(
    key: string
  ): string {

    return this.languageService
      .translate(key);
  }


  /* =========================
     AUTH
  ========================= */

  isLoggedIn(): boolean {

    const token =
      localStorage.getItem(
        'token'
      );

    return !!token;
  }


  isAdmin(): boolean {

    const role =
      localStorage.getItem(
        'role'
      );

    return (
      role?.toLowerCase() ===
      'admin'
    );
  }


  logout(): void {

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'userEmail'
    );

    localStorage.removeItem(
      'role'
    );

    this.desktopMenuOpen =
      false;

    this.sidebarOpen =
      false;

    this.router.navigate([
      '/login'
    ]);
  }


  /* =========================
     LANGUAGE CHANGE
  ========================= */

  changeLanguage(
    language: AppLanguage
  ): void {

    this.languageService
      .setLanguage(language);
  }


  /* =========================
     LOCATION DISPLAY
  ========================= */

  getSelectedLocationLabel():
    string {

    const keyMap:
      Record<string, string> = {

      Dhaka: 'dhaka',

      Chattogram:
        'chattogram',

      Sylhet: 'sylhet',

      Rajshahi:
        'rajshahi',

      Khulna: 'khulna'
    };


    const key =
      keyMap[
        this.selectedLocation
      ];


    return key
      ? this.t(key)
      : this.selectedLocation;
  }


  /* =========================
     HOME
  ========================= */

  goHome(): void {

    this.searchText = '';

    this.state.setSearch('');

    this.state.setCategory(0);

    this.showLocationMenu =
      false;

    this.desktopMenuOpen =
      false;

    this.sidebarOpen =
      false;

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

    this.state.setSearch(
      value
    );

    if (
      this.router.url
        .split('?')[0] !== '/'
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

    if (
      this.router.url
        .split('?')[0] !== '/'
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

    this.desktopMenuOpen =
      false;

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

    this.showLocationMenu =
      false;

    this.desktopMenuOpen =
      !this.desktopMenuOpen;
  }


  closeDesktopMenu(): void {

    this.desktopMenuOpen =
      false;
  }


  /* =========================
     DOCUMENT CLICK
  ========================= */

  @HostListener(
    'document:click'
  )
  closeMenus(): void {

    this.showLocationMenu =
      false;

    this.desktopMenuOpen =
      false;
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

  if (!data || !data.id) {
    this.sidebarOpen = false;
    return;
  }

  this.searchText = '';

  this.state.setSearch('');

  this.state.setCategory(
    Number(data.id)
  );

  this.sidebarOpen = false;

  this.router.navigateByUrl('/');
}


  /* =========================
     CART DRAWER
  ========================= */

openCartDrawer(): void {

  document.body.classList.add('cart-open');

  window.dispatchEvent(
    new CustomEvent('open-cart-drawer')
  );

}

}