import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/product_provider.dart';
import '../widgets/product_grid_item.dart';
import '../widgets/product_list_item.dart';
import 'add_product_screen.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/text_styles.dart';

class ProductListScreen extends StatefulWidget {
  const ProductListScreen({super.key});

  @override
  State<ProductListScreen> createState() => _ProductListScreenState();
}

class _ProductListScreenState extends State<ProductListScreen> with SingleTickerProviderStateMixin {
  bool _isGridView = true;
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _loadProducts();
    
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeIn),
    );
    
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Future<void> _loadProducts() async {
    await Provider.of<ProductProvider>(context, listen: false).fetchProducts();
  }

  Widget _buildView() {
    final productProvider = Provider.of<ProductProvider>(context);
    final products = productProvider.products;
    final status = productProvider.status;
    
    if (status == ProductStatus.loading && products.isEmpty) {
      return _buildLoadingView();
    } else if (status == ProductStatus.error && products.isEmpty) {
      return _buildErrorView(productProvider.errorMessage);
    } else if (products.isEmpty) {
      return _buildEmptyView();
    }
    
    return FadeTransition(
      opacity: _fadeAnimation,
      child: _isGridView
          ? GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.75,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
              ),
              itemCount: products.length,
              itemBuilder: (context, index) {
                return ProductGridItem(product: products[index]);
              },
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: products.length,
              itemBuilder: (context, index) {
                return ProductListItem(product: products[index]);
              },
            ),
    );
  }

  Widget _buildLoadingView() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(),
          SizedBox(height: 16),
          Text('Loading products...', style: TextStyles.body1),
        ],
      ),
    );
  }

  Widget _buildErrorView(String message) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error_outline, size: 48, color: AppColors.error),
          const SizedBox(height: 16),
          Text('Oops! Something went wrong', style: TextStyles.headline5),
          const SizedBox(height: 8),
          Text(message, style: TextStyles.body2, textAlign: TextAlign.center),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: _loadProducts,
            child: const Text('Try Again'),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyView() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.shopping_bag_outlined, size: 64, color: AppColors.textSecondary),
          const SizedBox(height: 16),
          const Text('No products found', style: TextStyles.headline5),
          const SizedBox(height: 8),
          const Text(
            'There are no products available right now.\nTry adding some products!',
            style: TextStyles.body2,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              Navigator.push(
                context, 
                MaterialPageRoute(builder: (context) => const AddProductScreen()),
              );
            },
            child: const Text('Add Product'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Products'),
        actions: [
          IconButton(
            icon: Icon(_isGridView ? Icons.list : Icons.grid_view),
            onPressed: () {
              setState(() {
                _isGridView = !_isGridView;
                _animationController.reset();
                _animationController.forward();
              });
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadProducts,
        child: _buildView(),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context, 
            MaterialPageRoute(builder: (context) => const AddProductScreen()),
          );
        },
        backgroundColor: AppColors.primary,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}