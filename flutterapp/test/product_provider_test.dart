import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:xprizo_app/features/products/models/product_model.dart';
import 'package:xprizo_app/features/products/providers/product_provider.dart';
import 'package:xprizo_app/features/products/services/product_service.dart';
import 'package:xprizo_app/core/exceptions/api_exception.dart';

// Generate mock classes
@GenerateMocks([ProductService])
import 'product_provider_test.mocks.dart';

void main() {
  late MockProductService mockProductService;
  late ProductProvider productProvider;

  setUp(() {
    mockProductService = MockProductService();
    productProvider = ProductProvider(productService: mockProductService);
  });

  group('ProductProvider', () {
    final testProducts = [
      Product(
        id: '1',
        name: 'Test Product',
        description: 'This is a test product',
        price: 99.99,
        imageUrl: 'https://example.com/image.jpg',
        category: 'Test',
        isAvailable: true,
        createdAt: DateTime.now(),
      ),
    ];

    test('initial state is correct', () {
      expect(productProvider.products, isEmpty);
      expect(productProvider.selectedProduct, isNull);
      expect(productProvider.paymentLink, isNull);
      expect(productProvider.status, ProductStatus.initial);
      expect(productProvider.errorMessage, isEmpty);
    });

    test('fetchProducts updates products and status on success', () async {
      // Arrange
      when(mockProductService.getProducts())
          .thenAnswer((_) async => testProducts);

      // Act
      await productProvider.fetchProducts();

      // Assert
      expect(productProvider.status, ProductStatus.loaded);
      expect(productProvider.products, equals(testProducts));
      expect(productProvider.errorMessage, isEmpty);
      
      verify(mockProductService.getProducts()).called(1);
    });

    test('fetchProducts updates status and error message on failure', () async {
      // Arrange
      const errorMessage = 'Failed to fetch products';
      when(mockProductService.getProducts())
          .thenThrow(ApiException(errorMessage));

      // Act
      await productProvider.fetchProducts();

      // Assert
      expect(productProvider.status, ProductStatus.error);
      expect(productProvider.products, isEmpty);
      expect(productProvider.errorMessage, equals(errorMessage));
      
      verify(mockProductService.getProducts()).called(1);
    });

    test('getPaymentLink updates paymentLink and status on success', () async {
      // Arrange
      const testProductId = '1';
      const testPaymentLink = 'https://payment.example.com/link';
      
      when(mockProductService.getPaymentLink(testProductId))
          .thenAnswer((_) async => testPaymentLink);

      // Act
      await productProvider.getPaymentLink(testProductId);

      // Assert
      expect(productProvider.status, ProductStatus.loaded);
      expect(productProvider.paymentLink, equals(testPaymentLink));
      expect(productProvider.errorMessage, isEmpty);
      
      verify(mockProductService.getPaymentLink(testProductId)).called(1);
    });

    test('addProduct returns true and refreshes products on success', () async {
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
      
      when(mockProductService.addProduct(product))
          .thenAnswer((_) async => true);
          
      when(mockProductService.getProducts())
          .thenAnswer((_) async => [...testProducts, product]);

      // Act
      final result = await productProvider.addProduct(product);

      // Assert
      expect(result, true);
      expect(productProvider.status, ProductStatus.loaded);
      
      verify(mockProductService.addProduct(product)).called(1);
      verify(mockProductService.getProducts()).called(1);
    });
  });
}