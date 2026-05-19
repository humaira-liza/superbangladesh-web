import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CartService } from '../../services/cart';
import { ProductStateService } from '../../services/product-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar {

  searchText = '';

  showChat = false;

  constructor(
    public cart: CartService,
    private router: Router,
    private state: ProductStateService
  ) {}

  isLoggedIn(): boolean {

    const token = localStorage.getItem('token');

    return !!token;
  }

  isAdmin(): boolean {

    const role = localStorage.getItem('role');

    return role?.toLowerCase() === 'admin';
  }

  logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');

    this.router.navigate(['/login']);
  }

  goHome() {

    this.searchText = '';

    this.state.setSearch('');
    this.state.setCategory(0);

    this.router.navigate(['/']);
  }

  search() {

    const value = this.searchText.trim();

    this.state.setCategory(0);

    this.state.setSearch(value);

    this.router.navigate(['/']);
  }

  clearSearch() {

    this.searchText = '';

    this.state.setSearch('');

    this.router.navigate(['/']);
  }

  toggleChat() {

    this.showChat = !this.showChat;
  }
}