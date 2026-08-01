import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-floating-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './floating-cart.html',
  styleUrls: ['./floating-cart.css']
})
export class FloatingCart {

  constructor(public cart: CartService, public languageService: LanguageService) {}

  t(key: string): string {
    return this.languageService.translate(key);
  }

}
