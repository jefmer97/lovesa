import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/activity_plan.dart';
import '../repositories/activity_repository.dart';

class SaveActivityParams extends Equatable {
  final ActivityEntity activity;
  final bool isEdit;

  const SaveActivityParams({required this.activity, this.isEdit = false});

  @override
  List<Object?> get props => [activity, isEdit];
}

class SaveActivity implements UseCase<ActivityEntity, SaveActivityParams> {
  final ActivityRepository repository;

  SaveActivity(this.repository);

  @override
  Future<Either<Failure, ActivityEntity>> call(SaveActivityParams params) async {
    if (params.isEdit && params.activity.id.isNotEmpty) {
      return await repository.updateActivity(params.activity.id, params.activity);
    } else {
      return await repository.createActivity(params.activity);
    }
  }
}
