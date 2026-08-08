import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LanguageService } from '../../services/language.service';


@Component({
  selector: 'app-rewards',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule
  ],

  templateUrl: './rewards.html',

  styleUrls: ['./rewards.css']
})
export class Rewards {

  constructor(
    public languageService: LanguageService
  ) {}
}
