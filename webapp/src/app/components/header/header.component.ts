import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container header-container">
        <a routerLink="/" class="logo">Xprizo Shop</a>
        <nav class="navigation">
          <a routerLink="/products" routerLinkActive="active" class="nav-link">Products</a>
          <a routerLink="/add-product" routerLinkActive="active" class="nav-link">Add Product</a>
        </nav>
      </div>
    </header>
  `,
  styles: `
    .header {
      background-color: var(--primary);
      color: var(--white);
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--white);
      text-decoration: none;
      transition: opacity 0.2s ease;
    }
    
    .logo:hover {
      opacity: 0.9;
    }
    
    .navigation {
      display: flex;
      gap: 1.5rem;
    }
    
    .nav-link {
      color: var(--white);
      text-decoration: none;
      font-weight: 500;
      transition: opacity 0.2s ease;
      padding: 0.5rem 0;
      position: relative;
    }
    
    .nav-link:hover {
      opacity: 0.9;
    }
    
    .nav-link.active::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background-color: var(--white);
      border-radius: 1px;
    }
    
    @media (max-width: 768px) {
      .header-container {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `
})
export class HeaderComponent {}