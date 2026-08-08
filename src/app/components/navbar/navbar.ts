import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Router,
  RouterModule
} from '@angular/router';

import {
  FormsModule
} from '@angular/forms';

import {
  CommonModule,
  isPlatformBrowser
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

import {
  MapLoaderService
} from '../../services/maploader.service';

import {
  SettingsService
} from '../../services/settings.service';


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
export class Navbar implements OnInit {

  private readonly isBrowser: boolean;

isMobile = false;

  /* =========================
     SEARCH
  ========================= */

  searchText = '';
showMobileSearch = false;

  /* =========================
     LOCATION
  ========================= */

  selectedLocation = 'Dhaka';

  showLocationMenu = false;

  // 'main' -> ছোট মেনু (Use my current location / Change City)
  // 'cities' -> সিটি লিস্ট
  locationMenuStep:
    'main' | 'cities' = 'main';

  locatingCurrentLocation = false;

  // "Location is off, help me turn it on" modal
  // (mobile + desktop উভয় জায়গা থেকেই এই একই
  // modal ট্রিগার হয় — useCurrentLocationNavbar() থেকে)
  showLocationHelp = false;

  locationHelpReason:
    'denied' | 'unavailable' | 'timeout' | 'unsupported' = 'denied';


  /* =========================
     CHAT
     (Admin panel > Footer Management থেকে
     এই লিংক/নাম্বারগুলো বদলানো যায়)
  ========================= */

  showChat = false;

  readonly footerApi =
    'https://superbangladesh-api-1.onrender.com/api/footer-settings/active';

  chatContact = {
    phone: '+8801756442133',
    messengerUrl: 'https://www.facebook.com/share/1C1rQ6txJr/',
    whatsappNumber: '8801756442133',
    instagramUrl: ''
  };


  /* =========================
     SITE LOGO
     (Admin panel > Site Settings থেকে
     লোগো পরিবর্তন করা যায়)

     ⚠️ LOGO FIX v2: প্রথমে fallback হিসেবে favicon.ico
     ব্যবহার করা হয়েছিল, কিন্তু সেটা আসলে Angular CLI-র
     ডিফল্ট গোলাপি "A" আইকন — তাই reload করলে ১ সেকেন্डের
     জন্য ভুল ব্র্যান্ডের আইকন ফ্ল্যাশ করতো, তারপর আসল
     লোগো লোড হয়ে ঠিক হয়ে যেত। এখন fallback হলো সম্পূর্ণ
     transparent ১x১ pixel — তাই লোড হওয়ার আগ পর্যন্ত কোনো
     ভুল আইকনই দেখাবে না, শুধু পাশের "Super Bangladesh"
     লেখাটা দেখা যাবে (brand-logo-র width/height ফিক্সড
     থাকায় কোনো layout jump ও হবে না)।
  ========================= */

  readonly fallbackLogoUrl =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ycQAOw==';

  logoUrl = this.fallbackLogoUrl;


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
    public languageService: LanguageService,
    private mapLoader: MapLoaderService,
    private http: HttpClient,
    private settingsService: SettingsService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {

    this.isBrowser =
      isPlatformBrowser(platformId);

    // ✅ window/localStorage শুধু browser-এ পড়া হচ্ছে,
    // যাতে SSR/prerender এর সময় এই কম্পোনেন্ট ভেঙে না যায়
    // (এটাই মোবাইল লোকেশন বার মাঝে মাঝে না দেখানোর কারণ ছিল)
    if (this.isBrowser) {

      this.isMobile =
        window.innerWidth <= 768;

      this.selectedLocation =
        localStorage.getItem(
          'selectedLocation'
        ) || 'Dhaka';
    }
  }


  ngOnInit(): void {

    // Admin panel > Site Settings থেকে বসানো লোগো লোড হয়
    // (না পেলে ডিফল্ট favicon-ই থেকে যাবে)
    //
    // ⚠️ ZONELESS FIX: এই অ্যাপে zone.js নেই (Angular zoneless),
    // তাই HttpClient response আসার পরে plain field (this.logoUrl)
    // বদলালেও Angular নিজে থেকে re-render করে না — যতক্ষণ না কোনো
    // click-এর মতো Angular-tracked event CD চালায়। এই জন্যই আগে
    // লোগো প্রথমে ভাঙা দেখাতো, আর লোগোতে ক্লিক করলে (যেটা একটা
    // Angular click event, তাই CD চলে) ঠিক হয়ে যেত। markForCheck()
    // এখন response আসামাত্রই re-render বাধ্য করে।
    this.settingsService
      .getSettings()
      .subscribe({
        next: (res) => {

          if (res?.logoUrl) {
            this.logoUrl = res.logoUrl;
          }

          this.cdr.markForCheck();
        },
        error: () => {
          // API না পেলেও ডিফল্ট লোগো দিয়ে navbar কাজ করবে
        }
      });

    // Admin panel এ Footer Management থেকে বসানো
    // Messenger/WhatsApp/Instagram লিংক এখানে লোড হয়
    this.http
      .get<any>(this.footerApi)
      .subscribe({
        next: (res) => {

          if (!res) {
            return;
          }

          if (res.phone) {
            this.chatContact.phone = res.phone;
          }

          if (res.messengerUrl) {
            this.chatContact.messengerUrl = res.messengerUrl;
          }

          if (res.whatsappNumber) {
            this.chatContact.whatsappNumber = res.whatsappNumber;
          }

          if (res.instagramUrl) {
            this.chatContact.instagramUrl = res.instagramUrl;
          }

          this.cdr.markForCheck();
        },
        error: () => {
          // API না পেলেও আগের ডিফল্ট নাম্বার/লিংক দিয়ে চ্যাট বাটন কাজ করবে
        }
      });
  }


  /* =========================
     LOGO IMAGE FAILS TO LOAD
     (admin panel-এর logoUrl নিজেই যদি ভাঙা/৪০৪ হয়,
     তাহলে favicon fallback-এ চলে যাবে — চিরস্থায়ী
     broken-image icon আর দেখাবে না)
  ========================= */

  onLogoError(): void {

    if (this.logoUrl !== this.fallbackLogoUrl) {
      this.logoUrl = this.fallbackLogoUrl;
      this.cdr.markForCheck();
    }
  }


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

  this.showMobileSearch = false;

  this.state.setMobileSearch(false);

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

    if (this.showLocationMenu) {
      this.locationMenuStep = 'main';
    }
  }


  showCityList(): void {

    this.locationMenuStep = 'cities';
  }


  backToLocationMain(): void {

    this.locationMenuStep = 'main';
  }


  selectLocation(
    location: string
  ): void {

    this.selectedLocation =
      location;

    this.showLocationMenu =
      false;

    this.locationMenuStep = 'main';

    localStorage.setItem(
      'selectedLocation',
      location
    );
  }


  /* =========================
     USE MY CURRENT LOCATION
     (নেভবারের জন্য)
  ========================= */

  useCurrentLocationNavbar(): void {

    if (!this.isBrowser || !navigator.geolocation) {

      this.openLocationHelp('unsupported');
      return;
    }

    this.locatingCurrentLocation = true;

    navigator.geolocation.getCurrentPosition(

      async (pos) => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const label =
          await this.mapLoader.reverseGeocode(
            lat,
            lng
          );

        this.locatingCurrentLocation = false;

        const knownCities =
          ['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna'];

        const matched = knownCities.find((city) =>
          label.toLowerCase().includes(city.toLowerCase())
        );

        this.selectLocation(matched || label || 'Dhaka');

        // ⚠️ ZONELESS FIX: navigator.geolocation callbacks and raw
        // fetch() (inside reverseGeocode) run outside Angular's
        // tracked contexts, so the app never knows state changed.
        // Without this, the UI stayed stuck on "Finding your
        // location..." forever even though the work had finished.
        this.cdr.markForCheck();
      },

      (err) => {

        this.locatingCurrentLocation = false;

        // ⚠️ LOCATION-OFF FIX: previously this just showed a plain
        // alert() with no way to actually fix the problem, so once
        // a user denied the permission once, the button looked
        // "broken" forever (the browser won't re-prompt). Now we
        // open an in-app help panel — same on mobile and desktop —
        // that explains *why* it failed and exactly where to turn
        // location back on for their device/browser, with a
        // "Try Again" button and (on Android) a real deep-link
        // into the system Location settings.
        if (err && err.code === err.PERMISSION_DENIED) {

          this.openLocationHelp('denied');

        } else if (err && err.code === err.POSITION_UNAVAILABLE) {

          this.openLocationHelp('unavailable');

        } else if (err && err.code === err.TIMEOUT) {

          this.openLocationHelp('timeout');

        } else {

          this.openLocationHelp('denied');
        }

        // ⚠️ ZONELESS FIX: same as above — geolocation error
        // callback is untracked by Angular, so force a UI update.
        this.cdr.markForCheck();
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }


  /* =========================
     LOCATION OFF -> HELP PANEL
     (মোবাইল/ডেস্কটপ উভয় জায়গা থেকেই
     useCurrentLocationNavbar() এই একই
     মেথড কল করে, তাই ফিক্স একবারেই
     দুই জায়গায় কাজ করবে)
  ========================= */

  openLocationHelp(
    reason: 'denied' | 'unavailable' | 'timeout' | 'unsupported'
  ): void {

    this.locationHelpReason = reason;
    this.showLocationHelp = true;
    this.showLocationMenu = false;

    this.cdr.markForCheck();
  }


  closeLocationHelp(): void {

    this.showLocationHelp = false;
  }


  retryLocation(): void {

    this.showLocationHelp = false;
    this.useCurrentLocationNavbar();
  }


  goToCityListFromHelp(): void {

    this.showLocationHelp = false;
    this.locationMenuStep = 'cities';
    this.showLocationMenu = true;
  }


  get isAndroid(): boolean {

    return (
      this.isBrowser &&
      /android/i.test(navigator.userAgent)
    );
  }


  get isIOS(): boolean {

    return (
      this.isBrowser &&
      /iphone|ipad|ipod/i.test(navigator.userAgent)
    );
  }


  // Android Chrome একটি বিশেষ intent:// URI মেনে চলে যা সরাসরি
  // সিস্টেমের Location সেটিংস স্ক্রিন খুলে দিতে পারে — এটা আসলেই
  // কাজ করে। কিন্তু iOS Safari এবং ডেস্কটপ ব্রাউজারে security
  // কারণে ওয়েবপেজ থেকে সরাসরি browser/OS-এর privacy settings খোলা
  // সম্ভব না (কোনো ওয়েবসাইটই এটা পারে না) — তাই ওই ক্ষেত্রে
  // step-by-step নির্দেশনাই একমাত্র উপায়, যা modal-এ দেখানো হয়।
  openDeviceLocationSettings(): void {

    if (!this.isBrowser || !this.isAndroid) {
      return;
    }

    try {

      window.location.href =
        'intent:#Intent;action=android.settings.LOCATION_SOURCE_SETTINGS;end';

    } catch {
      // Deep link ব্যর্থ হলেও modal-এর ধাপগুলো তো আছেই
    }
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

@HostListener('window:resize')
onResize(): void {

  this.isMobile = window.innerWidth <= 768;

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

toggleMobileSearch(): void {

  this.showMobileSearch =
    !this.showMobileSearch;

  this.state.setMobileSearch(
    this.showMobileSearch
  );

  if (this.showMobileSearch) {

    this.router.navigate(['/']);

  } else {

    this.searchText = '';

    this.state.setSearch('');

  }

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