export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currencyCode: string;
  imageUrl?: string;
  paymentUrl?: string;
}

export interface AddProductRequest {
  name: string;
  description: string;
  amount: number;
  currencyCode: string;
  reference: string;
}

export interface AddProductResponse {
  success: boolean;
  id?: string;
  message?: string;
}