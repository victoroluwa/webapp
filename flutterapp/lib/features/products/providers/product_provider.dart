import 'package:flutter/foundation.dart';
import '../models/product_model.dart';
import '../services/product_service.dart';
import '../../../core/exceptions/api_exception.dart';

enum ProductStatus { initial, loading, loaded, error }

class ProductProvider with ChangeNotifier {
  final ProductService _productService;
  
  List<Product> _products = [];
  List<Product> get products => _products;
  
  Product? _selectedProduct;
  Product? get selectedProduct => _selectedProduct;
  
  String? _paymentLink;
  String? get paymentLink => _paymentLink;
  
  ProductStatus _status = ProductStatus.initial;
  ProductStatus get status => _status;
  
  String _errorMessage = '';
  String get errorMessage => _errorMessage;

  ProductProvider({ProductService? productService}) 
      : _productService = productService ?? ProductService();

  Future<void> fetchProducts() async {
    try {
      _status = ProductStatus.loading;
      notifyListeners();
      
      _products = await _productService.getProducts();
      
      _status = ProductStatus.loaded;
    } catch (e) {
      _status = ProductStatus.error;
      _errorMessage = e is ApiException ? e.message : 'Failed to load products';
    } finally {
      notifyListeners();
    }
  }

  Future<void> fetchProductDetails(String productId) async {
    try {
      _status = ProductStatus.loading;
      notifyListeners();
      
      _selectedProduct = await _productService.getProductDetails(productId);
      
      _status = ProductStatus.loaded;
    } catch (e) {
      _status = ProductStatus.error;
      _errorMessage = e is ApiException ? e.message : 'Failed to load product details';
    } finally {
      notifyListeners();
    }
  }

  Future<void> getPaymentLink(String productId) async {
    try {
      _status = ProductStatus.loading;
      notifyListeners();
      
      _paymentLink = await _productService.getPaymentLink(productId);
      
      _status = ProductStatus.loaded;
    } catch (e) {
      _status = ProductStatus.error;
      _errorMessage = e is ApiException ? e.message : 'Failed to generate payment link';
    } finally {
      notifyListeners();
    }
  }

  Future<bool> addProduct(Product product) async {
    try {
      _status = ProductStatus.loading;
      notifyListeners();
      
      final result = await _productService.addProduct(product);
      
      if (result) {
        await fetchProducts(); // Refresh the product list
      } else {
        _status = ProductStatus.error;
        _errorMessage = 'Failed to add product';
        notifyListeners();
      }
      
      return result;
    } catch (e) {
      _status = ProductStatus.error;
      _errorMessage = e is ApiException ? e.message : 'Failed to add product';
      notifyListeners();
      return false;
    }
  }

  void selectProduct(Product product) {
    _selectedProduct = product;
    notifyListeners();
  }

  void clearSelectedProduct() {
    _selectedProduct = null;
    _paymentLink = null;
    notifyListeners();
  }
}