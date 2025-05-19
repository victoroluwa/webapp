# Xprizo Flutter App

A Flutter application that interacts with the Xprizo API to display, view details of, and add products.

## Features

- Product listing screen displaying products from the Xprizo API
- Product details screen with payment link integration
- Add product screen to create new products
- Clean, Apple-inspired UI with smooth animations
- Comprehensive error handling and loading states
- Unit tests for API service and state management

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   flutter pub get
   ```
3. Run the app:
   ```
   flutter run
   ```

## API Integration

The app connects to the Xprizo API using the following endpoints:

- `/Item/ProductList` - Get all products
- `/Item/Product/{id}` - Get details of a specific product
- `/Item/AddProduct` - Add a new product
- `/Payment/GenerateLink` - Generate payment link for a product

## Development Notes

- The application uses Provider for state management
- Mock HTTP responses are available for development and testing
- The API client is designed to handle various error cases
- UI follows Apple's design language with appropriate animations

## Testing

Run the tests with:

```
flutter test
```

## Project Structure

```
lib/
├── core/
│   ├── api/
│   ├── exceptions/
│   ├── theme/
│   └── utils/
├── features/
│   └── products/
│       ├── models/
│       ├── providers/
│       ├── screens/
│       ├── services/
│       └── widgets/
└── main.dart
test/
├── product_provider_test.dart
└── product_service_test.dart
```