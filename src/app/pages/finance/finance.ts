import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finance.html',
  styleUrls: ['./finance.css']
})
export class Finance {

  revenue = 18860;
  profit = 50;
  invest = 4000;

}