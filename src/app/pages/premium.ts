import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-premium',
  imports: [CommonModule],
  template: `
    <div class="container">

      <!-- HERO -->
      <div class="hero">
        <h1>🥇 Premium Care</h1>
        <p>Upgrade your shopping experience with exclusive benefits</p>
      </div>

      <!-- PRICING CARD -->
      <div class="pricing">

        <div class="card">
          <h2>Premium Plan</h2>

          <div class="price">
            ৳199 <span>/ month</span>
          </div>

          <ul>
            <li>🚀 Faster delivery</li>
            <li>🎯 Priority support</li>
            <li>💸 Exclusive discounts</li>
            <li>🔒 Secure priority checkout</li>
            <li>🎁 Special member offers</li>
          </ul>

          <button class="btn">Upgrade Now</button>
        </div>

      </div>

      <!-- EXTRA INFO -->
      <div class="info">
        <div class="info-card">
          <h3>🚀 Fast Delivery</h3>
          <p>Get your products delivered faster than regular users.</p>
        </div>

        <div class="info-card">
          <h3>💬 24/7 Support</h3>
          <p>Our premium users get instant support anytime.</p>
        </div>

        <div class="info-card">
          <h3>🎁 Exclusive Deals</h3>
          <p>Access special offers only for premium members.</p>
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

    /* HERO */
    .hero {
      text-align: center;
      margin-bottom: 30px;
    }

    .hero h1 {
      font-size: 34px;
      margin-bottom: 10px;
      background: linear-gradient(90deg, #6366f1, #9333ea);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero p {
      color: #666;
      font-size: 16px;
    }

    /* PRICING */
    .pricing {
      display: flex;
      justify-content: center;
      margin-bottom: 40px;
    }

    .card {
      background: #fff;
      padding: 25px;
      border-radius: 16px;
      width: 320px;
      text-align: center;
      box-shadow: 0 6px 18px rgba(0,0,0,0.1);
      transition: 0.3s;
    }

    .card:hover {
      transform: translateY(-6px);
    }

    .price {
      font-size: 28px;
      font-weight: bold;
      margin: 15px 0;
      color: #4f46e5;
    }

    .price span {
      font-size: 14px;
      color: #777;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 20px 0;
    }

    ul li {
      margin-bottom: 10px;
      font-size: 14px;
    }

    /* BUTTON */
    .btn {
      background: linear-gradient(90deg, #6366f1, #4f46e5);
      color: white;
      border: none;
      padding: 10px;
      width: 100%;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      transition: 0.3s;
    }

    .btn:hover {
      opacity: 0.9;
    }

    /* INFO */
    .info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
    }

    .info-card {
      background: #fff;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .info-card h3 {
      margin-bottom: 10px;
    }

    .info-card p {
      font-size: 14px;
      color: #555;
    }

    @media (max-width: 600px) {
      .hero h1 {
        font-size: 24px;
      }
    }
  `]
})
export class Premium {}