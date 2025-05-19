import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;

import 'core/theme/app_theme.dart';
import 'features/products/providers/product_provider.dart';
import 'features/products/screens/product_list_screen.dart';
import 'features/products/services/product_service.dart';
import 'core/api/api_client.dart';
import 'core/utils/http_mock.dart';

// Development entry point with mock data
void main() {
  // Set up mock HTTP client
  final http.Client mockClient = MockHttpClient.getMockClient();
  final ApiClient apiClient = ApiClient(httpClient: mockClient);
  final ProductService productService = ProductService(apiClient: apiClient);

  runApp(MyApp(productService: productService));
}

class MyApp extends StatelessWidget {
  final ProductService productService;
  
  const MyApp({super.key, required this.productService});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => ProductProvider(productService: productService),
        ),
      ],
      child: MaterialApp(
        title: 'Xprizo Store (Dev)',
        theme: AppTheme.lightTheme,
        debugShowCheckedModeBanner: true,
        home: const ProductListScreen(),
      ),
    );
  }
}