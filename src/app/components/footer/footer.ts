import {
  Component
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  LanguageService
} from '../../services/language.service';


@Component({
  selector: 'app-footer',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './footer.html',

  styleUrls: [
    './footer.css'
  ]
})
export class Footer {


  constructor(
    public languageService:
      LanguageService
  ) {}


  t(
    key: string
  ): string {

    return this.languageService
      .translate(key);
  }

}