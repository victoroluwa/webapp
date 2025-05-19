import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/theme/app_theme.dart';
import 'features/products/providers/product_provider.dart';
import 'features/products/screens/product_list_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ProductProvider()),
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