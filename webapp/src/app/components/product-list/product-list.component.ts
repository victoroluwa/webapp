import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="products-page">
      <h1 class="page-title">Products</h1>
      
      <div *ngIf="loading" class="loader"></div>
      
      <div *ngIf="error" class="alert alert-error">
        {{ error }}
      </div>
      
      <div *ngIf="!loading && !error && products.length === 0" class="no-products">
        <p>No products found.</p>
      </div>
      
      <div *ngIf="!loading && products.length > 0" class="grid">
        <div *ngFor="let product of products" class="card product-card" [routerLink]="['/products', product.id]">
          <div class="product-image" [style.background-image]="product.imageUrl ? 'url(' + product.imageUrl + ')' : null">
            <div *ngIf="!product.imageUrl" class="no-image">No Image</div>
          </div>
          <div class="product-details">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-description">{{ product.description }}</p>
            <p class="product-price">{{ product.price | currency:product.currencyCode }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .products-page {
      padding: 1rem 0 3rem;
    }
    
    .product-card {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .product-image {
      height: 200px;
      background-size: cover;
      background-position: center;
      background-color: var(--grey-200);
      border-radius: 4px;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .no-image {
      color: var(--grey-500);
      font-size: 0.875rem;
    }
    
    .product-details {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    
    .product-name {
      margin-bottom: 0.5rem;
      color: var(--grey-900);
    }
    
    .product-description {
      color: var(--grey-700);
      flex-grow: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .product-price {
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--primary);
      margin-top: 1rem;
    }
    
    .no-products {
      text-align: center;
      padding: 3rem 0;
      color: var(--grey-600);
    }
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
        console.error('Error loading products:', err);
      }
    });
  }
}