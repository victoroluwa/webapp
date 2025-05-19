import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AddProductRequest } from '../../models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="add-product-page">
      <h1 class="page-title">Add New Product</h1>
      
      <div *ngIf="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
      
      <div *ngIf="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>
      
      <div class="card form-card">
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Product Name</label>
            <input 
              type="text" 
              id="name" 
              formControlName="name" 
              [class.error]="isFieldInvalid('name')"
            >
            <div *ngIf="isFieldInvalid('name')" class="error-message">
              Product name is required
            </div>
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description" 
              formControlName="description" 
              rows="4"
              [class.error]="isFieldInvalid('description')"
            ></textarea>
            <div *ngIf="isFieldInvalid('description')" class="error-message">
              Product description is required
            </div>
          </div>
          
          <div class="form-group">
            <label for="amount">Price</label>
            <input 
              type="number" 
              id="amount" 
              formControlName="amount" 
              step="0.01"
              [class.error]="isFieldInvalid('amount')"
            >
            <div *ngIf="isFieldInvalid('amount')" class="error-message">
              Valid price is required (must be greater than 0)
            </div>
          </div>
          
          <div class="form-group">
            <label for="currencyCode">Currency</label>
            <select 
              id="currencyCode" 
              formControlName="currencyCode"
              [class.error]="isFieldInvalid('currencyCode')"
            >
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="GBP">British Pound (GBP)</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="resetForm()">Reset</button>
            <button 
              type="submit" 
              class="btn-primary" 
              [disabled]="productForm.invalid || isSubmitting"
            >
              <span *ngIf="isSubmitting" class="button-spinner"></span>
              {{ isSubmitting ? 'Adding Product...' : 'Add Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `
    .add-product-page {
      padding: 2rem 0;
    }
    
    .form-card {
      max-width: 800px;
      margin: 0 auto;
    }
    
    input.error, textarea.error, select.error {
      border-color: var(--error);
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }
    
    .button-spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: var(--white);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 0.5rem;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `
})
export class AddProductComponent {
  productForm: FormGroup;
  isSubmitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      currencyCode: ['EUR', [Validators.required]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  resetForm(): void {
    this.productForm.reset({
      currencyCode: 'EUR'
    });
    this.successMessage = null;
    this.errorMessage = null;
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    const formValues = this.productForm.value;
    
    // Generate a unique reference ID (could use a UUID library in a real app)
    const reference = 'ref-' + Date.now();

    const productRequest: AddProductRequest = {
      name: formValues.name,
      description: formValues.description,
      amount: formValues.amount,
      currencyCode: formValues.currencyCode,
      reference
    };

    this.productService.addProduct(productRequest).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        
        if (response.success) {
          this.successMessage = 'Product added successfully!';
          this.resetForm();
        } else {
          this.errorMessage = response.message || 'Failed to add product';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'An error occurred while adding the product';
        console.error('Error adding product:', err);
      }
    });
  }
}