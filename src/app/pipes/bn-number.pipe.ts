import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

/*
  ==========================================================
  BANGLA NUMBER PIPE (বাংলা সংখ্যা পাইপ)
  ==========================================================

  ব্যবহার (templates এ):

    {{ product.price | bnNumber }}          → ৳ চিহ্ন ছাড়া
    {{ product.price | bnNumber:'৳' }}      → prefix সহ (৳ ১৫০)
    {{ quantity | bnNumber:'':' পিস' }}      → suffix সহ (৫ পিস)

  ভাষা English (en) হলে সংখ্যা যেমন আছে তেমনই থাকবে (150).
  ভাষা Bangla (bn) হলে সংখ্যা বাংলা অঙ্কে দেখাবে (১৫০),
  এবং কমা/দশমিক সবকিছু ঠিক রেখেই রূপান্তর হয় (১,৫০০.৫০)।

  এই পাইপ pure না রেখে ভাষা পরিবর্তনে সাথে সাথে re-render
  হওয়ার জন্য impure রাখা হয়েছে (signal-based LanguageService
  এর সাথে ব্যবহার করা হচ্ছে বলে এটি নিরাপদ)।
*/

const EN_TO_BN_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯'
};

export function toBanglaDigits(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  return String(value).replace(/[0-9]/g, (d) => EN_TO_BN_DIGITS[d] ?? d);
}

@Pipe({
  name: 'bnNumber',
  standalone: true,
  pure: false
})
export class BnNumberPipe implements PipeTransform {

  private readonly languageService = inject(LanguageService);

  transform(
    value: string | number | null | undefined,
    prefix: string = '',
    suffix: string = ''
  ): string {

    if (value === null || value === undefined || value === '') {
      return '';
    }

    if (!this.languageService.isBangla()) {
      return `${prefix}${value}${suffix}`;
    }

    return `${prefix}${toBanglaDigits(value)}${suffix}`;
  }
}
