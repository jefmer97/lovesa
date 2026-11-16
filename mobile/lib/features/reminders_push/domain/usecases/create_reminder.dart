import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/reminder.dart';
import '../repositories/reminder_repository.dart';

class CreateReminderParams extends Equatable {
  final String title;
  final String body;
  final DateTime remindAt;
  final String? url;

  const CreateReminderParams({
    required this.title,
    required this.body,
    required this.remindAt,
    this.url,
  });

  @override
  List<Object?> get props => [title, body, remindAt, url];
}

class CreateReminder implements UseCase<Reminder, CreateReminderParams> {
  final ReminderRepository repository;

  CreateReminder(this.repository);

  @override
  Future<Either<Failure, Reminder>> call(CreateReminderParams params) async {
    return await repository.createReminder(
      title: params.title,
      body: params.body,
      remindAt: params.remindAt,
      url: params.url,
    );
  }
}
