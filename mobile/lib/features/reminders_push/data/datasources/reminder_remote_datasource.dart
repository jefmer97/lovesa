import '../../../../core/network/api_client.dart';
import '../../../../core/error/failures.dart';
import '../models/reminder_model.dart';

abstract class ReminderRemoteDataSource {
  Future<List<ReminderModel>> getReminders();
  Future<ReminderModel> createReminder(Map<String, dynamic> data);
  Future<ReminderModel> updateReminder(String id, Map<String, dynamic> data);
  Future<void> deleteReminder(String id);
  Future<bool> sendTestPush({String? title, String? body});
}

class ReminderRemoteDataSourceImpl implements ReminderRemoteDataSource {
  final ApiClient apiClient;

  ReminderRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<ReminderModel>> getReminders() async {
    try {
      final response = await apiClient.get('/notifications/reminders');
      if (response is List) {
        return response
            .map((item) => ReminderModel.fromJson(item as Map<String, dynamic>))
            .toList();
      }
      return [];
    } catch (e) {
      throw ServerException(message: e.toString());
    }
  }

  @override
  Future<ReminderModel> createReminder(Map<String, dynamic> data) async {
    try {
      final response = await apiClient.post('/notifications/reminders', body: data);
      return ReminderModel.fromJson(response as Map<String, dynamic>);
    } catch (e) {
      throw ServerException(message: e.toString());
    }
  }

  @override
  Future<ReminderModel> updateReminder(String id, Map<String, dynamic> data) async {
    try {
      final response = await apiClient.put('/notifications/reminders/$id', body: data);
      return ReminderModel.fromJson(response as Map<String, dynamic>);
    } catch (e) {
      throw ServerException(message: e.toString());
    }
  }

  @override
  Future<void> deleteReminder(String id) async {
    try {
      await apiClient.delete('/notifications/reminders/$id');
    } catch (e) {
      throw ServerException(message: e.toString());
    }
  }

  @override
  Future<bool> sendTestPush({String? title, String? body}) async {
    try {
      await apiClient.post('/notifications/test', body: {
        if (title != null) 'title': title,
        if (body != null) 'body': body,
      });
      return true;
    } catch (e) {
      throw ServerException(message: e.toString());
    }
  }
}
