import '../../../../core/network/api_client.dart';
import '../../../../core/error/failures.dart';
import '../models/chat_message_model.dart';

abstract class AiRemoteDataSource {
  Future<List<ChatMessageModel>> getHistory();
  Future<ChatMessageModel> sendMessage({
    required String message,
    List<ChatMessageModel>? history,
  });
  Future<void> clearHistory();
}

class AiRemoteDataSourceImpl implements AiRemoteDataSource {
  final ApiClient apiClient;

  AiRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<ChatMessageModel>> getHistory() async {
    try {
      final response = await apiClient.get('/ai/history');
      if (response is List) {
        return response
            .map((item) => ChatMessageModel.fromJson(item as Map<String, dynamic>))
            .toList();
      }
      return [];
    } catch (e) {
      throw ServerException(message: e.toString());
    }
  }

  @override
  Future<ChatMessageModel> sendMessage({
    required String message,
    List<ChatMessageModel>? history,
  }) async {
    try {
      final body = {
        'message': message,
        if (history != null && history.isNotEmpty)
          'messages': history.map((m) => m.toJson()).toList(),
      };
      final response = await apiClient.post('/ai/chat', body: body);

      if (response is Map<String, dynamic>) {
        return ChatMessageModel.fromJson(response);
      } else if (response is String) {
        return ChatMessageModel(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          role: 'model',
          content: response,
          createdAt: DateTime.now(),
        );
      }
      return ChatMessageModel(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        role: 'model',
        content: response.toString(),
        createdAt: DateTime.now(),
      );
    } catch (e) {
      throw ServerException(message: e.toString());
    }
  }

  @override
  Future<void> clearHistory() async {
    try {
      await apiClient.delete('/ai/history');
    } catch (e) {
      throw ServerException(message: e.toString());
    }
  }
}
