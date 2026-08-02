import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


/*
  ==========================================================
  AUTO TRANSLATE SERVICE  (স্বয়ংক্রিয় অনুবাদ সার্ভিস)
  ==========================================================

  এটা admin panel এর যেকোনো ফর্মে ব্যবহার করা যাবে —
  ইংরেজি লিখলে বাংলা, বা বাংলা লিখলে ইংরেজি অটো বসিয়ে দিতে।

  এটা কোনো API key ছাড়াই কাজ করা ফ্রি translate endpoint
  ব্যবহার করে, তাই কোনো billing/setup লাগবে না।

  ব্যবহার (উদাহরণ — একটা component এ):

    constructor(private autoTranslate: AutoTranslateService) {}

    onEnglishBlur() {
      if (!this.product.nameBn) {
        this.autoTranslate
          .translate(this.product.nameEn, 'bn')
          .subscribe(bn => this.product.nameBn = bn);
      }
    }

  নোট: এটা একটা ফ্রি পাবলিক endpoint, তাই মাঝে মাঝে ধীরে
  কাজ করতে পারে বা সাময়িকভাবে বন্ধ থাকতে পারে — এজন্য এটা
  কখনোই কোনো field জোর করে ওভাররাইট করে না, এবং fail করলে
  চুপচাপ খালি স্ট্রিং ফেরত দেয় (এরর দেখায় না, ইউজার নিজেই
  টাইপ করে দিতে পারবে)।
*/

@Injectable({
  providedIn: 'root'
})
export class AutoTranslateService {

  constructor(
    private http: HttpClient
  ) {}


  /**
   * text কে targetLang এ অনুবাদ করে।
   * targetLang = 'bn' মানে ইংরেজি থেকে বাংলা
   * targetLang = 'en' মানে বাংলা থেকে ইংরেজি
   */
  translate(
    text: string,
    targetLang: 'en' | 'bn'
  ): Observable<string> {

    const value = (text || '').trim();

    if (!value) {
      return of('');
    }

    const sourceLang =
      targetLang === 'bn' ? 'en' : 'bn';

    const url =
      'https://translate.googleapis.com/translate_a/single' +
      '?client=gtx' +
      '&sl=' + sourceLang +
      '&tl=' + targetLang +
      '&dt=t' +
      '&q=' + encodeURIComponent(value);

    return this.http.get<any>(url).pipe(

      map((res: any) => {

        if (!res || !res[0]) {
          return '';
        }

        return res[0]
          .map((chunk: any) => chunk[0])
          .join('');
      }),

      catchError(() => of(''))
    );
  }
}