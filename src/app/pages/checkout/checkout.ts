
import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CartService } from '../../services/cart';
import { LanguageService } from '../../services/language.service';
import { MapLoaderService } from '../../services/maploader.service';
import { BnNumberPipe } from '../../pipes/bn-number.pipe';

declare const L: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, BnNumberPipe],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss']
})
export class Checkout implements OnInit, AfterViewInit {

  @ViewChild('mapContainer')
  mapContainer!: ElementRef<HTMLDivElement>;

  items: any[] = [];

  total: number = 0;

  name = '';
  phone = '';
  address = '';

  payment = 'BKASH';
  paidAmount = 0;

  // LOCATION PICKER STATE
  latitude: number | null = null;
  longitude: number | null = null;
  locationLabel = '';
  locating = false;
  searchQuery = '';
  searchResults: Array<{ label: string; lat: number; lng: number }> = [];

  private map: any = null;
  private marker: any = null;

  // BACKEND URL
  apiUrl =
    'https://superbangladesh-api-1.onrender.com';

  constructor(
    private cart: CartService,
    private router: Router,
    private http: HttpClient,
    public languageService: LanguageService,
    private mapLoader: MapLoaderService
  ) {}


  /* =========================
     IMAGE SUPPORT
  ========================= */
  getImage(url: string): string {

    if (!url) {
      return 'assets/no-image.png';
    }

    // Cloudinary / full URL
    if (url.startsWith('http')) {
      return url;
    }

    // Old Upload Folder
    return `${this.apiUrl}/uploads/${url}`;
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


  ngOnInit(): void {

    const token = localStorage.getItem('token');

    if (!token) {
      alert(this.t('loginRequiredCheckout'));
      this.router.navigate(['/login']);
      return;
    }

    this.items = this.cart.getItems();

    this.total = this.cart.getTotal();
  }


  ngAfterViewInit(): void {

    this.initMap();
  }


  /* =========================
     INIT MAP (DHAKA DEFAULT)
  ========================= */

  private initMap(): void {

    if (!this.mapContainer) {
      return;
    }

    this.mapLoader
      .load()
      .then((leaflet: any) => {

        const defaultLat = 23.8103;
        const defaultLng = 90.4125;

        this.map = leaflet.map(
          this.mapContainer.nativeElement
        ).setView([defaultLat, defaultLng], 12);

        leaflet.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
          }
        ).addTo(this.map);

        this.marker = leaflet.marker(
          [defaultLat, defaultLng],
          { draggable: true }
        ).addTo(this.map);

        this.marker.on('dragend', () => {

          const pos = this.marker.getLatLng();

          this.setLocation(pos.lat, pos.lng);
        });

        this.map.on('click', (e: any) => {

          this.marker.setLatLng(e.latlng);

          this.setLocation(e.latlng.lat, e.latlng.lng);
        });
      })
      .catch(() => {
        // map unavailable (e.g. during SSR) — user can still
        // type the address manually, so we just skip the map
      });
  }


  /* =========================
     SET LOCATION + REVERSE GEOCODE
  ========================= */

  private async setLocation(
    lat: number,
    lng: number
  ): Promise<void> {

    this.latitude = lat;
    this.longitude = lng;

    const label =
      await this.mapLoader.reverseGeocode(lat, lng);

    if (label) {

      this.locationLabel = label;

      if (!this.address) {
        this.address = label;
      }
    }
  }


  /* =========================
     SEARCH LOCATION
  ========================= */

  async onSearchLocation(): Promise<void> {

    this.searchResults =
      await this.mapLoader.search(this.searchQuery);
  }

  selectSearchResult(
    result: { label: string; lat: number; lng: number }
  ): void {

    this.searchResults = [];
    this.searchQuery = result.label;

    if (this.map && this.marker) {

      this.map.setView([result.lat, result.lng], 16);
      this.marker.setLatLng([result.lat, result.lng]);
    }

    this.setLocation(result.lat, result.lng);
  }


  /* =========================
     USE MY CURRENT LOCATION
  ========================= */

  useMyLocation(): void {

    if (!navigator.geolocation) {

      alert(this.t('geolocationNotSupported'));
      return;
    }

    this.locating = true;

    navigator.geolocation.getCurrentPosition(
      (pos) => {

        this.locating = false;

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        if (this.map && this.marker) {

          this.map.setView([lat, lng], 16);
          this.marker.setLatLng([lat, lng]);
        }

        this.setLocation(lat, lng);
      },
      (err) => {

        this.locating = false;

        // TIMEOUT (3) আগে হ্যান্ডল হতো না — কোনো timeout option
        // দেওয়া ছিল না, ফলে মোবাইলে GPS slow/off থাকলে বা
        // permission prompt silently আটকে গেলে callback-ই কখনো
        // fire হতো না, আর "locating..." spinner চিরকাল আটকে থাকত
        // (দেখতে মনে হতো কিছুই হচ্ছে না)।
        if (err && err.code === err.TIMEOUT) {

          alert(
            this.t('geolocationTimeout') ||
            this.t('geolocationDenied')
          );

        } else {

          alert(this.t('geolocationDenied'));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }


  /* =========================
     PLACE ORDER
  ========================= */

  placeOrder(): void {

    if (
      !this.name ||
      !this.phone ||
      !this.address
    ) {

      alert(this.t('fillAllFields'));

      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {

      alert(this.t('loginFirst'));

      this.router.navigate(['/login']);

      return;
    }

    const orderData = {

      name: this.name,

      phone: this.phone,

      address: this.address,

      latitude: this.latitude,

      longitude: this.longitude,

      totalAmount: this.total + 60,

      paymentMethod: this.payment,

      paidAmount: this.paidAmount,

      items: this.items.map((i: any) => ({

        productId: i.id,

        productName: i.name,

        quantity: i.qty || 1,

        price: i.price
      }))
    };

    const headers = new HttpHeaders({

      Authorization: `Bearer ${token}`

    });

    this.http.post(

      `${this.apiUrl}/api/orders`,

      orderData,

      { headers }

    )
    .subscribe({

      next: () => {

        this.cart.clear();

        alert(this.t('orderPlacedSuccess'));

        this.router.navigate(['/orders']);
      },

      error: (err) => {

        alert(
          err?.error?.message ||
          this.t('orderFailed')
        );
      }
    });
  }
}
