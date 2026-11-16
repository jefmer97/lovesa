import '../../../../core/network/api_client.dart';
import '../../../../core/error/failures.dart';
import '../models/activity_model.dart';

abstract class ActivityRemoteDataSource {
  Future<List<ActivityModel>> getActivities({String? search});
  Future<ActivityModel> getActivity(String id);
  Future<ActivityModel> createActivity(ActivityModel activity);
  Future<ActivityModel> updateActivity(String id, ActivityModel activity);
  Future<void> deleteActivity(String id);
}

class ActivityRemoteDataSourceImpl implements ActivityRemoteDataSource {
  final ApiClient apiClient;

  ActivityRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<ActivityModel>> getActivities({String? search}) async {
    try {
      final endpoint = search != null && search.isNotEmpty
          ? '/activities?search=${Uri.encodeComponent(search)}'
          : '/activities';
      final response = await apiClient.get(endpoint);
      if (response is List) {
        return response
            .map((item) => ActivityModel.fromJson(item as Map<String, dynamic>))
            .toList();
      }
      return [];
    } catch (e) {
      throw ServerException(message: e.toString());
    }
  }

  @override
  Future<ActivityModel> getActivity(String id) async {
    try {
      final response = await apiClient.get('/activities/$id');
      return ActivityModel.fromJson(response as Map<String, dynamic>);
    } catch (e) {
      throw ServerException(message: e.toString());
    }
  }

  @override
  Future<ActivityModel> createActivity(ActivityModel activity) async {
    try {
      final response = await apiClient.post('/activities', body: activity.toJson());
      return ActivityModel.fromJson(response as Map<String, dynamic>);
    } catch (e) {
      throw ServerException(message: e.toString());
    }
  }

  @override
  Future<ActivityModel> updateActivity(String id, ActivityModel activity) async {
    try {
      final response = await apiClient.put('/activities/$id', body: activity.toJson());
      return ActivityModel.fromJson(response as Map<String, dynamic>);
    } catch (e) {
      throw ServerException(message: e.toString());
    }
  }

  @override
  Future<void> deleteActivity(String id) async {
    try {
      await apiClient.delete('/activities/$id');
    } catch (e) {
      throw ServerException(message: e.toString());
    }
  }
}
