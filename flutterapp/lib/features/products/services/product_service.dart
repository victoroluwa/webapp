import '../models/product_model.dart';
import '../../../core/api/api_client.dart';
import '../../../core/exceptions/api_exception.dart';

class ProductService {
  final ApiClient _apiClient;

  ProductService({ApiClient? apiClient}) : _apiClient = apiClient ?? ApiClient();

  Future<List<Product>> getProducts() async {
    try {
      final response = await _apiClient.get('/Item/ProductList');
      
      if (response == null) {
        return [];
      }
      
      if (response is List) {
        return response.map((item) => Product.fromJson(item)).toList();
      } else if (response is Map && response.containsKey('items')) {
        final items = response['items'] as List;
        return items.map((item) => Product.fromJson(item)).toList();
      }
      
      throw ApiException('Unexpected response format');
    } catch (e) {
      if (e is ApiException) {
        rethrow;
      }
      throw ApiException('Failed to get products: $e');
    }
  }

  Future<Product> getProductDetails(String productId) async {
    try {
      final response = await _apiClient.get('/Item/Product/$productId');
      return Product.fromJson(response);
    } catch (e) {
      if (e is ApiException) {
        rethrow;
      }
      throw ApiException('Failed to get product details: $e');
    }
  }

  Future<String> getPaymentLink(String productId) async {
    try {
      final response = await _apiClient.post('/Payment/GenerateLink', {
        'productId': productId,
      });
      
      if (response is Map && response.containsKey('paymentLink')) {
        return response['paymentLink'];
      }
      
      throw ApiException('Payment link not found in response');
    } catch (e) {
      if (e is ApiException) {
        rethrow;
      }
      throw ApiException('Failed to generate payment link: $e');
    }
  }

  Future<bool> addProduct(Product product) async {
    try {
      final response = await _apiClient.post('/Item/AddProduct', product.toJson());
      
      if (response is Map && response.containsKey('success')) {
        return response['success'] == true;
      }
      
      return true; // Assume success if no specific success flag
    } catch (e) {
      if (e is ApiException) {
        rethrow;
      }
      throw ApiException('Failed to add product: $e');
    }
  }
}