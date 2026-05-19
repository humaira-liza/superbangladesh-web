import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-safety',
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>🛡 Safety Center</h1>
        <p>Your security is our top priority. Shop with confidence.</p>
      </div>

      <div class="grid">
        <div class="card">
          <div class="icon">💳</div>
          <h3>Secure Payments</h3>
          <p>
            All transactions are encrypted and protected. We support trusted
            payment methods like bKash, card, and more.
          </p>
        </div>

        <div class="card">
          <div class="icon">📦</div>
          <h3>Safe Delivery</h3>
          <p>
            Our delivery partners ensure safe and timely delivery of your
            products right to your doorstep.
          </p>
        </div>

        <div class="card">
          <div class="icon">🛍️</div>
          <h3>Trusted Sellers</h3>
          <p>
            We verify all sellers to maintain quality and trust in every product
            you purchase.
          </p>
        </div>

        <div class="card">
          <div class="icon">🔒</div>
          <h3>Privacy Protection</h3>
          <p>
  Your personal data is secure. We never share your information
  with third parties without your consent.
</p>
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
      margin-bottom: 10px;
    }

    .header p {
      color: #666;
      font-size: 16px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }

    .card {
      background: #fff;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      text-align: center;
      transition: 0.3s;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 18px rgba(0,0,0,0.12);
    }

    .icon {
      font-size: 40px;
      margin-bottom: 10px;
    }

    h3 {
      margin: 10px 0;
      font-size: 18px;
    }

    p {
      font-size: 14px;
      color: #555;
    }

    @media (max-width: 600px) {
      .header h1 {
        font-size: 24px;
      }
    }
  `]
})
export class Safety {}