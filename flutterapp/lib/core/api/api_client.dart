import 'dart:convert';
import 'package:http/http.dart' as http;
import '../exceptions/api_exception.dart';

class ApiClient {
  final String baseUrl = 'https://api.xprizo.com'; // Replace with actual Xprizo API base URL
  final http.Client _httpClient;

  ApiClient({http.Client? httpClient}) : _httpClient = httpClient ?? http.Client();

  Future<dynamic> get(String endpoint) async {
    try {
      final response = await _httpClient.get(
        Uri.parse('$baseUrl$endpoint'),
        headers: {'Content-Type': 'application/json'},
      );
      
      return _handleResponse(response);
    } catch (e) {
      throw ApiException('Failed to connect to the server: $e');
    }
  }

  Future<dynamic> post(String endpoint, dynamic data) async {
    try {
      final response = await _httpClient.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(data),
      );
      
      return _handleResponse(response);
    } catch (e) {
      throw ApiException('Failed to connect to the server: $e');
    }
  }

  dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return null;
      return json.decode(response.body);
    } else if (response.statusCode == 404) {
      throw ApiException('Resource not found: ${response.reasonPhrase}');
    } else if (response.statusCode >= 400 && response.statusCode < 500) {
      throw ApiException('Client error: ${response.reasonPhrase} (${response.statusCode})');
    } else if (response.statusCode >= 500) {
      throw ApiException('Server error: ${response.reasonPhrase} (${response.statusCode})');
    } else {
      throw ApiException('Unknown error occurred: ${response.reasonPhrase} (${response.statusCode})');
    }
  }
}