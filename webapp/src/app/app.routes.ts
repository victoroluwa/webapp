import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'payment-success', component: PaymentSuccessComponent },
  { path: '**', redirectTo: 'products' }
];