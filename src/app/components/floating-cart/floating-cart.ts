import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-floating-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './floating-cart.html',
  styleUrls: ['./floating-cart.css']
})
export class FloatingCart {

  constructor(public cart:CartService){}

}