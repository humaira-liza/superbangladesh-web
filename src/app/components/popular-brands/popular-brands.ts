import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popular-brands',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popular-brands.html',
  styleUrls: ['./popular-brands.css']
})
export class PopularBrands {

  brands = [
    {
      name: 'PRAN',
      image: '/assets/brands/pran.png'
    },
    {
      name: 'Reckitt',
      image: '/assets/brands/reckitt.png'
    },
    {
      name: 'Nestlé',
      image: '/assets/brands/nestle.png'
    },
    {
      name: 'Unilever',
      image: '/assets/brands/unilever.png'
    },
    {
      name: 'Marico',
      image: '/assets/brands/marico.png'
    },
    {
      name: 'Godrej',
      image: '/assets/brands/godrej.png'
    },
    {
      name: 'Coca-Cola',
      image: '/assets/brands/cocacola.png'
    },
    {
      name: 'MGI',
      image: '/assets/brands/mgi.png'
    }
  ];

}