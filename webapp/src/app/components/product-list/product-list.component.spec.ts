import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductService', ['getProducts']);

    await TestBed.configureTestingModule({
      imports: [ProductListComponent, RouterLink],
      providers: [
        { provide: ProductService, useValue: spy }
      ]
    }).compileComponents();

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    productServiceSpy.getProducts.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display products when loaded successfully', () => {
    const mockProducts: Product[] = [
      { 
        id: '1', 
        name: 'Test Product 1', 
        description: 'Description 1', 
        price: 100, 
        currencyCode: 'EUR' 
      },
      { 
        id: '2', 
        name: 'Test Product 2', 
        description: 'Description 2', 
        price: 200, 
        currencyCode: 'EUR' 
      }
    ];
    
    productServiceSpy.getProducts.and.returnValue(of(mockProducts));
    
    fixture.detectChanges();
    
    const productElements = fixture.debugElement.queryAll(By.css('.product-card'));
    expect(productElements.length).toBe(2);
    
    const productNames = fixture.debugElement.queryAll(By.css('.product-name'));
    expect(productNames[0].nativeElement.textContent).toContain('Test Product 1');
    expect(productNames[1].nativeElement.textContent).toContain('Test Product 2');
  });

  it('should display loading state initially', () => {
    productServiceSpy.getProducts.and.returnValue(of([]));
    
    expect(component.loading).toBe(true);
    
    const loaderElement = fixture.debugElement.query(By.css('.loader'));
    expect(loaderElement).toBeFalsy(); // Not in the DOM until change detection
    
    fixture.detectChanges();
    
    expect(component.loading).toBe(false); // Changed after service call resolves
  });

  it('should display error message when products fail to load', () => {
    productServiceSpy.getProducts.and.returnValue(throwError(() => new Error('Network error')));
    
    fixture.detectChanges();
    
    expect(component.error).toBe('Failed to load products. Please try again later.');
    expect(component.loading).toBe(false);
    
    const errorElement = fixture.debugElement.query(By.css('.alert-error'));
    expect(errorElement.nativeElement.textContent.trim()).toBe(component.error);
  });

  it('should display empty state when no products exist', () => {
    productServiceSpy.getProducts.and.returnValue(of([]));
    
    fixture.detectChanges();
    
    const emptyElement = fixture.debugElement.query(By.css('.no-products'));
    expect(emptyElement).toBeTruthy();
    expect(emptyElement.nativeElement.textContent).toContain('No products found');
  });
});