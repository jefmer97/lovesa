import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/activity_plan.dart';

abstract class ActivityRepository {
  Future<Either<Failure, List<ActivityEntity>>> getActivities({String? search});
  Future<Either<Failure, ActivityEntity>> getActivity(String id);
  Future<Either<Failure, ActivityEntity>> createActivity(ActivityEntity activity);
  Future<Either<Failure, ActivityEntity>> updateActivity(String id, ActivityEntity activity);
  Future<Either<Failure, void>> deleteActivity(String id);
}
