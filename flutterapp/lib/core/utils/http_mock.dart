import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

class MockHttpClient {
  static http.Client getMockClient() {
    return MockClient((request) async {
      final uri = request.url;
      final endpoint = uri.path;
      
      // Mock product list
      if (endpoint == '/Item/ProductList') {
        return http.Response(
          json.encode(_mockProducts),
          200,
          headers: {'content-type': 'application/json'},
        );
      } 
      
      // Mock getting a single product
      else if (endpoint.startsWith('/Item/Product/')) {
        final productId = endpoint.split('/').last;
        final product = _mockProducts.firstWhere(
          (p) => p['id'] == productId,
          orElse: () => _mockProducts.first,
        );
        
        return http.Response(
          json.encode(product),
          200,
          headers: {'content-type': 'application/json'},
        );
      } 
      
      // Mock payment link generation
      else if (endpoint == '/Payment/GenerateLink') {
        return http.Response(
          json.encode({
            'success': true,
            'paymentLink': 'https://pay.example.com/product/${json.decode(request.body)['productId']}',
          }),
          200,
          headers: {'content-type': 'application/json'},
        );
      } 
      
      // Mock adding a product
      else if (endpoint == '/Item/AddProduct') {
        return http.Response(
          json.encode({
            'success': true,
            'id': 'new-product-${DateTime.now().millisecondsSinceEpoch}',
          }),
          201,
          headers: {'content-type': 'application/json'},
        );
      }
      
      // Return 404 for unhandled endpoints
      return http.Response('Not Found', 404);
    });
  }

  // Mock data for development and testing
  static final List<Map<String, dynamic>> _mockProducts = [
    {
      'id': 'product-1',
      'name': 'Premium Headphones',
      'description': 'Noise-cancelling wireless headphones with superior sound quality and 24-hour battery life.',
      'price': 299.99,
      'imageUrl': 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'category': 'Electronics',
      'isAvailable': true,
      'createdAt': DateTime.now().subtract(const Duration(days: 30)).toIso8601String(),
    },
    {
      'id': 'product-2',
      'name': 'Smart Watch Pro',
      'description': 'Track your fitness, receive notifications, and monitor your health with this waterproof smartwatch.',
      'price': 249.99,
      'imageUrl': 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'category': 'Wearables',
      'isAvailable': true,
      'createdAt': DateTime.now().subtract(const Duration(days: 15)).toIso8601String(),
    },
    {
      'id': 'product-3',
      'name': 'Slim Laptop Pro',
      'description': 'Ultra-thin, lightweight laptop with powerful performance and all-day battery life.',
      'price': 1299.99,
      'imageUrl': 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'category': 'Computers',
      'isAvailable': false,
      'createdAt': DateTime.now().subtract(const Duration(days: 45)).toIso8601String(),
    },
    {
      'id': 'product-4',
      'name': 'Ergonomic Office Chair',
      'description': 'Comfortable chair with lumbar support and adjustable height for your home office.',
      'price': 199.99,
      'imageUrl': 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'category': 'Furniture',
      'isAvailable': true,
      'createdAt': DateTime.now().subtract(const Duration(days: 10)).toIso8601String(),
    },
    {
      'id': 'product-5',
      'name': 'Wireless Gaming Mouse',
      'description': 'High-precision gaming mouse with customizable RGB lighting and programmable buttons.',
      'price': 79.99,
      'imageUrl': 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'category': 'Gaming',
      'isAvailable': true,
      'createdAt': DateTime.now().subtract(const Duration(days: 5)).toIso8601String(),
    },
    {
      'id': 'product-6',
      'name': '4K Smart TV',
      'description': 'Ultra HD display with smart features and voice control for an immersive viewing experience.',
      'price': 799.99,
      'imageUrl': 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'category': 'Electronics',
      'isAvailable': true,
      'createdAt': DateTime.now().subtract(const Duration(days: 20)).toIso8601String(),
    },
  ];
}