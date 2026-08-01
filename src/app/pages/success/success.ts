import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './success.html',
})
export class Success {

  constructor(public languageService: LanguageService) {}

  t(key: string): string {
    return this.languageService.translate(key);
  }
}
