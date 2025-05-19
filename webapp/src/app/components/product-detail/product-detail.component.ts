import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-detail-page">
      <div *ngIf="loading" class="loader"></div>
      
      <div *ngIf="error" class="alert alert-error">
        {{ error }}
      </div>
      
      <div *ngIf="!loading && !error && product" class="product-container">
        <div class="back-link" (click)="goBack()">← Back to Products</div>
        
        <div class="product-detail-card">
          <div class="product-detail-header">
            <div class="product-image" [style.background-image]="product.imageUrl ? 'url(' + product.imageUrl + ')' : null">
              <div *ngIf="!product.imageUrl" class="no-image">No Image</div>
            </div>
            
            <div class="product-info">
              <h1 class="product-name">{{ product.name }}</h1>
              <p class="product-price">{{ product.price | currency:product.currencyCode }}</p>
              
              <div class="payment-actions">
                <div *ngIf="paymentLinkLoading" class="mini-loader"></div>
                <div *ngIf="paymentLinkError" class="payment-error">{{ paymentLinkError }}</div>
                
                <ng-container *ngIf="!paymentLinkLoading && !paymentLinkError">
                  <a *ngIf="product.paymentUrl" [href]="product.paymentUrl" target="_blank" class="btn-primary payment-btn">
                    Proceed to Payment
                  </a>
                  <button *ngIf="!product.paymentUrl" (click)="generatePaymentLink()" class="btn-primary payment-btn">
                    Generate Payment Link
                  </button>
                </ng-container>
              </div>
            </div>
          </div>
          
          <div class="product-description-section">
            <h2>Product Description</h2>
            <p class="product-description">{{ product.description }}</p>
          </div>
          
          <div class="payment-info-section">
            <h3>Payment Information</h3>
            <p>To complete the payment simulation, use the following dummy credit card details:</p>
            <ul class="payment-info-list">
              <li><strong>Card Number:</strong> 4111</li>
              <li><strong>Card Holder:</strong> Any name</li>
              <li><strong>Expiry Date:</strong> Any future date</li>
              <li><strong>CVV:</strong> Any 3-digit number</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .product-detail-page {
      padding: 2rem 0;
    }
    
    .back-link {
      color: var(--primary);
      cursor: pointer;
      margin-bottom: 1.5rem;
      display: inline-block;
      font-weight: 500;
      transition: color 0.2s ease;
    }
    
    .back-link:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }
    
    .product-detail-card {
      background-color: var(--white);
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .product-detail-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      padding: 2rem;
    }
    
    .product-image {
      height: 300px;
      background-size: cover;
      background-position: center;
      background-color: var(--grey-200);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .product-info {
      display: flex;
      flex-direction: column;
    }
    
    .product-name {
      margin-bottom: 1rem;
      color: var(--grey-900);
    }
    
    .product-price {
      font-weight: 700;
      font-size: 2rem;
      color: var(--primary);
      margin-bottom: 2rem;
    }
    
    .payment-actions {
      margin-top: auto;
    }
    
    .payment-btn {
      display: inline-block;
      text-align: center;
      text-decoration: none;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      transition: all 0.3s ease;
    }
    
    .payment-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .product-description-section, .payment-info-section {
      padding: 2rem;
      border-top: 1px solid var(--grey-200);
    }
    
    .product-description {
      color: var(--grey-700);
      line-height: 1.6;
    }
    
    .payment-info-list {
      list-style-type: none;
      margin-top: 1rem;
    }
    
    .payment-info-list li {
      margin-bottom: 0.5rem;
      padding-left: 1.5rem;
      position: relative;
    }
    
    .payment-info-list li::before {
      content: '→';
      position: absolute;
      left: 0;
      color: var(--primary);
    }
    
    .mini-loader {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid var(--grey-300);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 0.5rem;
    }
    
    .payment-error {
      color: var(--error);
      margin-bottom: 1rem;
    }
    
    @media (max-width: 768px) {
      .product-detail-header {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  
  paymentLinkLoading = false;
  paymentLinkError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Product ID not provided';
      this.loading = false;
      return;
    }

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product details. Please try again later.';
        this.loading = false;
        console.error('Error loading product:', err);
      }
    });
  }

  generatePaymentLink(): void {
    if (!this.product) return;
    
    this.paymentLinkLoading = true;
    this.paymentLinkError = null;
    
    // Set return URL (where customer will be redirected after payment)
    const returnUrl = `${window.location.origin}/payment-success`;
    
    // First set the redirect URL
    this.productService.setProductRedirectUrl(this.product.id, returnUrl).subscribe({
      next: (success) => {
        if (success) {
          // Then fetch the product again to get the payment URL
          this.productService.getProductById(this.product!.id).subscribe({
            next: (updatedProduct) => {
              this.product = updatedProduct;
              this.paymentLinkLoading = false;
            },
            error: (err) => {
              this.paymentLinkError = 'Failed to generate payment link';
              this.paymentLinkLoading = false;
              console.error('Error getting updated product with payment URL:', err);
            }
          });
        } else {
          this.paymentLinkError = 'Failed to set redirect URL';
          this.paymentLinkLoading = false;
        }
      },
      error: (err) => {
        this.paymentLinkError = 'Failed to generate payment link';
        this.paymentLinkLoading = false;
        console.error('Error setting redirect URL:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}