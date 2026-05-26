import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-complaint',
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="container">

      <!-- HEADER -->
      <div class="header">
        <h1>⚠️ File a Complaint</h1>
        <p>We value your feedback. Please let us know your issue.</p>
      </div>

      <!-- FORM -->
      <div class="form-card">

        <input
          type="text"
          [(ngModel)]="name"
          placeholder="Your Name"
        />

        <input
          type="email"
          [(ngModel)]="email"
          placeholder="Your Email"
        />

        <textarea
          [(ngModel)]="message"
          placeholder="Write your complaint..."
        ></textarea>

        <button (click)="submit()">Submit Complaint</button>

      </div>

      <!-- SUCCESS -->
      <div class="success" *ngIf="success">
        ✅ Complaint submitted successfully!
      </div>

    </div>
  `,
  styles: [`
    .container {
      padding: 30px;
      max-width: 600px;
      margin: auto;
    }

    .header {
      text-align: center;
      margin-bottom: 25px;
    }

    .header h1 {
      font-size: 28px;
      margin-bottom: 8px;
    }

    .header p {
      color: #666;
      font-size: 14px;
    }

    .form-card {
      background: #fff;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);

      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    input, textarea {
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #ddd;
      font-size: 14px;
      outline: none;
    }

    textarea {
      min-height: 100px;
      resize: none;
    }

    input:focus, textarea:focus {
      border-color: #6366f1;
    }

    button {
      background: linear-gradient(90deg, #ef4444, #dc2626);
      color: white;
      border: none;
      padding: 10px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: 0.3s;
    }

    button:hover {
      opacity: 0.9;
    }

    .success {
      margin-top: 15px;
      text-align: center;
      color: green;
      font-weight: 600;
    }
  `]
})
export class Complaint {

  name = '';
  email = '';
  message = '';
  success = false;

  constructor(private http: HttpClient) {}

 submit() {

  // 🔥 TRIM FIX (IMPORTANT)
  if (!this.name.trim() || !this.email.trim() || !this.message.trim()) {
    alert('Please fill all fields!');
    return;
  }

  const data = {
    name: this.name,
    email: this.email,
    message: this.message
  };

  this.http.post('/api/complaints', data)
    .subscribe({
      next: () => {
        this.success = true;

        // 🔥 CLEAR FORM
        this.name = '';
        this.email = '';
        this.message = '';
      },
      error: () => {
        alert('Something went wrong!');
      }
    });
}
}