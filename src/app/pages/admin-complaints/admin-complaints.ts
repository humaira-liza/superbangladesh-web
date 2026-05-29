import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-admin-complaints',
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="container">

      <h1>⚠️ Complaints</h1>

      <!-- LOADING -->
      <div *ngIf="loading" class="empty">
        Loading complaints...
      </div>

      <!-- EMPTY -->
      <div *ngIf="!loading && complaints.length === 0" class="empty">
        No complaints yet
      </div>

      <!-- LIST -->
      <div *ngIf="!loading && complaints.length > 0">

        <div
          class="card"
          *ngFor="let c of complaints">

          <div class="top">

            <strong>
              {{ c.name }}
            </strong>

            <span>
              {{ c.createdAt | date:'medium' }}
            </span>

          </div>

          <div class="email">
            {{ c.email }}
          </div>

          <div class="msg">
            {{ c.message }}
          </div>

        </div>

      </div>

    </div>
  `,
  styles: [`
    .container{
      padding:30px;
      max-width:900px;
      margin:auto;
    }

    h1{
      margin-bottom:20px;
    }

    .empty{
      text-align:center;
      color:#777;
      margin-top:20px;
    }

    .card{
      background:#fff;
      padding:15px;
      border-radius:12px;
      margin-bottom:12px;
      box-shadow:0 4px 12px rgba(0,0,0,.08);
      transition:.3s;
    }

    .card:hover{
      transform:translateY(-3px);
    }

    .top{
      display:flex;
      justify-content:space-between;
      margin-bottom:5px;
    }

    .email{
      font-size:13px;
      color:#555;
      margin-bottom:8px;
    }

    .msg{
      font-size:14px;
      color:#222;
    }
  `]
})
export class AdminComplaints implements OnInit {

  apiUrl =
    'https://superbangladesh-api-1.onrender.com';

  complaints: any[] = [];

  loading = true;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    this.http.get<any[]>(
      `${this.apiUrl}/api/complaints`
    )
    .subscribe({

      next: (data) => {

        console.log(
          'COMPLAINTS:',
          data
        );

        this.complaints =
          [...(data || [])];

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (err) => {

        console.error(
          'COMPLAINT ERROR:',
          err
        );

        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }
}