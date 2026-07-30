import {
  Injectable,
  PLATFORM_ID,
  inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare const L: any;

@Injectable({
  providedIn: 'root'
})
export class MapLoaderService {

  private readonly platformId =
    inject(PLATFORM_ID);

  private loadPromise: Promise<any> | null = null;


  /* =========================
     LOAD LEAFLET (ONCE)
  ========================= */

  load(): Promise<any> {

    if (!isPlatformBrowser(this.platformId)) {
      return Promise.reject(
        'Map is only available in the browser'
      );
    }

    if (typeof L !== 'undefined') {
      return Promise.resolve(L);
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {

      const script =
        document.createElement('script');

      script.src =
        'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

      script.async = true;

      script.onload = () => resolve(L);

      script.onerror = () =>
        reject('Failed to load map library');

      document.body.appendChild(script);
    });

    return this.loadPromise;
  }


  /* =========================
     REVERSE GEOCODE
     (lat/lng -> address text)
  ========================= */

  async reverseGeocode(
    lat: number,
    lng: number
  ): Promise<string> {

    try {

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );

      const data = await res.json();

      return data?.display_name || '';

    } catch {

      return '';
    }
  }


  /* =========================
     FORWARD GEOCODE (SEARCH)
     (address text -> lat/lng list)
  ========================= */

  async search(
    query: string
  ): Promise<Array<{ label: string; lat: number; lng: number }>> {

    if (!query || query.trim().length < 3) {
      return [];
    }

    try {

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=bd&q=${encodeURIComponent(query)}`
      );

      const data = await res.json();

      return (data || []).map((d: any) => ({
        label: d.display_name,
        lat: parseFloat(d.lat),
        lng: parseFloat(d.lon)
      }));

    } catch {

      return [];
    }
  }
}
