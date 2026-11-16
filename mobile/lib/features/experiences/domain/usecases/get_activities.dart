import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/activity_plan.dart';
import '../repositories/activity_repository.dart';

class GetActivitiesParams extends Equatable {
  final String? search;

  const GetActivitiesParams({this.search});

  @override
  List<Object?> get props => [search];
}

class GetActivities implements UseCase<List<ActivityEntity>, GetActivitiesParams> {
  final ActivityRepository repository;

  GetActivities(this.repository);

  @override
  Future<Either<Failure, List<ActivityEntity>>> call(GetActivitiesParams params) async {
    return await repository.getActivities(search: params.search);
  }
}
