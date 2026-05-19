import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class Analytics {

  revenue = 18860;
  orders = 9;
  customers = 7;
  growth = 12;

}