import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:http/http.dart' as http;
import 'package:xprizo_app/core/api/api_client.dart';
import 'package:xprizo_app/features/products/models/product_model.dart';
import 'package:xprizo_app/features/products/services/product_service.dart';
import 'package:xprizo_app/core/exceptions/api_exception.dart';

// Generate mock classes
@GenerateMocks([ApiClient])
import 'product_service_test.mocks.dart';

void main() {
  late MockApiClient mockApiClient;
  late ProductService productService;

  setUp(() {
    mockApiClient = MockApiClient();
    productService = ProductService(apiClient: mockApiClient);
  });

  group('ProductService', () {
    test('getProducts returns list of products when API call is successful', () async {
      // Arrange
      final mockResponse = [
        {
          'id': '1',
          'name': 'Test Product',
          'description': 'This is a test product',
          'price': 99.99,
          'imageUrl': 'https://example.com/image.jpg',
          'category': 'Test',
          'isAvailable': true,
          'createdAt': '2023-01-01T00:00:00.000Z',
        }
      ];
      
      when(mockApiClient.get('/Item/ProductList'))
          .thenAnswer((_) async => mockResponse);

      // Act
      final result = await productService.getProducts();

      // Assert
      expect(result, isA<List<Product>>());
      expect(result.length, 1);
      expect(result[0].id, '1');
      expect(result[0].name, 'Test Product');
      expect(result[0].price, 99.99);
      
      verify(mockApiClient.get('/Item/ProductList')).called(1);
    });

    test('getProducts handles empty response correctly', () async {
      // Arrange
      when(mockApiClient.get('/Item/ProductList'))
          .thenAnswer((_) async => null);

      // Act
      final result = await productService.getProducts();

      // Assert
      expect(result, isEmpty);
      verify(mockApiClient.get('/Item/ProductList')).called(1);
    });

    test('getProducts throws ApiException when API call fails', () async {
      // Arrange
      when(mockApiClient.get('/Item/ProductList'))
          .thenThrow(ApiException('Network error'));

      // Act & Assert
      expect(
        () => productService.getProducts(),
        throwsA(isA<ApiException>().having(
          (e) => e.message,
          'message',
          'Network error',
        )),
      );
      
      verify(mockApiClient.get('/Item/ProductList')).called(1);
    });

    test('addProduct returns true when product is added successfully', () async {
      // Arrange
      final product = Product(
        id: '',
        name: 'New Product',
        description: 'A new product',
        price: 49.99,
        imageUrl: 'https://example.com/image.jpg',
        category: 'New',
        isAvailable: true,
        createdAt: DateTime.now(),
      );
      
      when(mockApiClient.post('/Item/AddProduct', any))
          .thenAnswer((_) async => {'success': true});

      // Act
      final result = await productService.addProduct(product);

      // Assert
      expect(result, true);
      verify(mockApiClient.post('/Item/AddProduct', any)).called(1);
    });
  });
}