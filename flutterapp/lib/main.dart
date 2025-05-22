import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'core/theme/app_theme.dart';
import 'core/api/api_client.dart';
import 'features/products/providers/product_provider.dart';
import 'features/products/screens/product_list_screen.dart';
import 'features/products/services/product_service.dart';

Future<void> main() async {
  await dotenv.load(fileName: ".env");
  
  final apiKey = dotenv.env['API_KEY'] ?? '';
  final apiClient = ApiClient(apiKey: apiKey);
  final productService = ProductService(apiClient: apiClient);

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
        title: 'Xprizo Store',
        theme: AppTheme.lightTheme,
        debugShowCheckedModeBanner: false,
        home: const ProductListScreen(),
      ),
    );
  }
}