import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product, AddProductRequest } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products', () => {
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

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('https://api.xprizo.com/api/v1/Item/ProductList');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should get product by id', () => {
    const mockProduct: Product = { 
      id: '1', 
      name: 'Test Product', 
      description: 'Test Description', 
      price: 100, 
      currencyCode: 'EUR',
      paymentUrl: 'https://payment.url'
    };

    service.getProductById('1').subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('https://api.xprizo.com/api/v1/Item/GetProduct/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should set product redirect url', () => {
    const mockResponse = { success: true };
    const productId = '123';
    const redirectUrl = 'https://example.com/return';

    service.setProductRedirectUrl(productId, redirectUrl).subscribe(result => {
      expect(result).toBe(true);
    });

    const req = httpMock.expectOne(request => 
      request.url === 'https://api.xprizo.com/api/v1/Item/SetProductRedirectUrl' && 
      request.params.get('id') === productId &&
      request.params.get('value') === redirectUrl
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should add a product', () => {
    const mockRequest: AddProductRequest = {
      name: 'New Product',
      description: 'New Description',
      amount: 150,
      currencyCode: 'EUR',
      reference: 'ref-12345'
    };

    const mockResponse = {
      success: true,
      id: '12345'
    };

    service.addProduct(mockRequest).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.id).toBe('12345');
    });

    const req = httpMock.expectOne('https://api.xprizo.com/api/v1/Item/AddProduct');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });
});