import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="payment-success-container">
      <div class="success-card">
        <div class="success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase. Your payment has been processed successfully.</p>
        
        <div class="success-actions">
          <a routerLink="/products" class="btn-primary">Continue Shopping</a>
        </div>
        
        <div class="auto-redirect">
          You will be redirected to the products page in {{ countdown }} seconds...
        </div>
      </div>
    </div>
  `,
  styles: `
    .payment-success-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 2rem;
    }
    
    .success-card {
      background-color: var(--white);
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      padding: 3rem;
      text-align: center;
      max-width: 600px;
    }
    
    .success-icon {
      width: 80px;
      height: 80px;
      background-color: var(--success);
      color: var(--white);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      margin: 0 auto 1.5rem;
      animation: bounce 1s ease;
    }
    
    .success-actions {
      margin-top: 2rem;
    }
    
    .success-actions .btn-primary {
      display: inline-block;
      text-decoration: none;
    }
    
    .auto-redirect {
      margin-top: 1.5rem;
      font-size: 0.875rem;
      color: var(--grey-600);
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-20px);
      }
      60% {
        transform: translateY(-10px);
      }
    }
  `
})
export class PaymentSuccessComponent implements OnInit {
  countdown = 5;
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    this.startCountdown();
  }
  
  startCountdown(): void {
    const timer = setInterval(() => {
      this.countdown--;
      
      if (this.countdown <= 0) {
        clearInterval(timer);
        this.router.navigate(['/products']);
      }
    }, 1000);
  }
}