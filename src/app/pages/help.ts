import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-help',
  imports: [CommonModule],
  template: `
    <div class="container">

      <!-- HEADER -->
      <div class="header">
        <h1>📞 Help & Support</h1>
        <p>We're here to help you anytime</p>
      </div>

      <!-- CONTACT -->
      <div class="contact">

        <!-- EMAIL -->
        <div class="card" (click)="email()">
          <div class="icon">📧</div>
          <h3>Email Support</h3>
          <p>support@myshop.com</p>
        </div>

        <!-- CALL -->
        <div class="card" (click)="call()">
          <div class="icon">📱</div>
          <h3>Call Us</h3>
          <p>0123456789</p>
        </div>

        <!-- WHATSAPP -->
        <div class="card" (click)="whatsapp()">
          <div class="icon">🟢</div>
          <h3>WhatsApp</h3>
          <p>Chat with us</p>
        </div>

      </div>

      <!-- FAQ -->
      <div class="faq">

        <h2>Frequently Asked Questions</h2>

        <div class="faq-item" (click)="go('order')">
          <h4>How do I place an order?</h4>
          <p>Add products to cart and checkout.</p>
        </div>

        <div class="faq-item" (click)="go('payment')">
          <h4>What payment methods are available?</h4>
          <p>bKash, card, cash on delivery.</p>
        </div>

        <div class="faq-item" (click)="go('track')">
          <h4>How can I track my order?</h4>
          <p>Check your Purchase History.</p>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .container {
      padding: 30px;
      max-width: 1100px;
      margin: auto;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header h1 {
      font-size: 32px;
    }

    .header p {
      color: #666;
    }

    .contact {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }

    .card {
      background: #fff;
      padding: 25px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      cursor: pointer;
      transition: 0.3s;
    }

    .card:hover {
      transform: translateY(-5px);
      background: #f3f4f6;
    }

    .icon {
      font-size: 30px;
      margin-bottom: 10px;
    }

    .faq h2 {
      text-align: center;
      margin-bottom: 20px;
    }

    .faq-item {
      background: #fff;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 12px;
      box-shadow: 0 3px 8px rgba(0,0,0,0.05);
      cursor: pointer;
    }

    .faq-item:hover {
      background: #eef2ff;
    }

    @media (max-width: 700px) {
      .contact {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class Help {

  constructor(private router: Router) {}

  // 📧 EMAIL
  email() {
    window.open(
      "https://mail.google.com/mail/?view=cm&to=support@myshop.com",
      "_blank"
    );
  }

  // 📱 CALL
  call() {
    window.location.href = "tel:0123456789";
  }

  // 🟢 WHATSAPP
  whatsapp() {
    window.open("https://wa.me/880123456789", "_blank");
  }

  // 🔁 FAQ NAVIGATION
  go(type: string) {

    if (type === 'order') {
      this.router.navigate(['/']);
    }

    if (type === 'payment') {
      this.router.navigate(['/']);
    }

    if (type === 'track') {
      this.router.navigate(['/purchase-history']);
    }

  }

}