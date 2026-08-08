import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface SiteSettings {
  id?: number;
  logoUrl?: string;
}


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private api =
    'https://superbangladesh-api-1.onrender.com/api/settings';

  constructor(
    private http: HttpClient
  ) {}

  // ==========================
  // GET SETTINGS
  // ==========================
  getSettings(): Observable<SiteSettings> {
    return this.http.get<SiteSettings>(this.api);
  }

  // ==========================
  // UPLOAD / REPLACE LOGO
  // ==========================
  uploadLogo(file: File): Observable<SiteSettings> {

    const fd = new FormData();
    fd.append('file', file);

    return this.http.post<SiteSettings>(
      `${this.api}/logo`,
      fd
    );
  }
}
