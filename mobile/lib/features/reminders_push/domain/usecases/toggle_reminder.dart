import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/reminder.dart';
import '../repositories/reminder_repository.dart';

class ToggleReminderParams extends Equatable {
  final String id;
  final bool isCompleted;

  const ToggleReminderParams({required this.id, required this.isCompleted});

  @override
  List<Object?> get props => [id, isCompleted];
}

class ToggleReminder implements UseCase<Reminder, ToggleReminderParams> {
  final ReminderRepository repository;

  ToggleReminder(this.repository);

  @override
  Future<Either<Failure, Reminder>> call(ToggleReminderParams params) async {
    return await repository.toggleReminderCompletion(params.id, params.isCompleted);
  }
}
