import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Product, AddProductRequest, AddProductResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://api.xprizo.com/api/v1';
  
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/Item/ProductList`)
      .pipe(
        catchError(error => {
          console.error('Error fetching products:', error);
          return of([]);
        })
      );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/Item/GetProduct/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching product with id ${id}:`, error);
          throw error;
        })
      );
  }

  setProductRedirectUrl(id: string, redirectUrl: string): Observable<boolean> {
    const params = new HttpParams()
      .set('id', id)
      .set('value', redirectUrl);
      
    return this.http.post<{success: boolean}>(`${this.apiUrl}/Item/SetProductRedirectUrl`, null, { params })
      .pipe(
        map(response => response.success),
        catchError(error => {
          console.error('Error setting redirect URL:', error);
          return of(false);
        })
      );
  }

  addProduct(product: AddProductRequest): Observable<AddProductResponse> {
    return this.http.post<AddProductResponse>(`${this.apiUrl}/Item/AddProduct`, product)
      .pipe(
        catchError(error => {
          console.error('Error adding product:', error);
          return of({ success: false, message: 'Failed to add product' });
        })
      );
  }
}