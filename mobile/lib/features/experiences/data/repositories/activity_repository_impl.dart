import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/activity_plan.dart';
import '../../domain/repositories/activity_repository.dart';
import '../datasources/activity_remote_datasource.dart';
import '../models/activity_model.dart';

class ActivityRepositoryImpl implements ActivityRepository {
  final ActivityRemoteDataSource remoteDataSource;

  ActivityRepositoryImpl({required this.remoteDataSource});

  ActivityModel _toModel(ActivityEntity entity) {
    if (entity is ActivityModel) return entity;
    return ActivityModel(
      id: entity.id,
      title: entity.title,
      description: entity.description,
      startDate: entity.startDate,
      endDate: entity.endDate,
      isAllDay: entity.isAllDay,
      notes: entity.notes,
      media: entity.media,
      planType: entity.planType,
      datePlan: entity.datePlan,
    );
  }

  @override
  Future<Either<Failure, List<ActivityEntity>>> getActivities({String? search}) async {
    try {
      final models = await remoteDataSource.getActivities(search: search);
      return Right(models);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, ActivityEntity>> getActivity(String id) async {
    try {
      final model = await remoteDataSource.getActivity(id);
      return Right(model);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, ActivityEntity>> createActivity(ActivityEntity activity) async {
    try {
      final model = await remoteDataSource.createActivity(_toModel(activity));
      return Right(model);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, ActivityEntity>> updateActivity(String id, ActivityEntity activity) async {
    try {
      final model = await remoteDataSource.updateActivity(id, _toModel(activity));
      return Right(model);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> deleteActivity(String id) async {
    try {
      await remoteDataSource.deleteActivity(id);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
