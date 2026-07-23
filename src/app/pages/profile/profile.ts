import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  fullName = '';
  email = '';
  phone = '';
  address = '';

  apiUrl = 'https://superbangladesh-api-1.onrender.com';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  getHeaders(): HttpHeaders {

    const token = localStorage.getItem('token') || '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

  }

  loadProfile(): void {

    this.http.get<any>(
      `${this.apiUrl}/api/users/profile`,
      {
        headers: this.getHeaders()
      }
    ).subscribe({

      next: (user) => {

        this.fullName = user.fullName || '';
        this.email = user.email || '';
        this.phone = user.phone || '';
        this.address = user.address || '';

      },

      error: (err) => {
        console.error(err);
      }

    });

  }

  saveProfile(): void {

    this.http.put<any>(
      `${this.apiUrl}/api/users/profile`,
      {
        fullName: this.fullName,
        phone: this.phone,
        address: this.address
      },
      {
        headers: this.getHeaders()
      }
    ).subscribe({

      next: () => {

        alert('Profile updated successfully.');

      },

      error: (err) => {

        console.error(err);
        alert('Profile update failed.');

      }

    });

  }

}