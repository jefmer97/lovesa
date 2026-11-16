import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/reminder.dart';

abstract class ReminderRepository {
  Future<Either<Failure, List<Reminder>>> getReminders();
  Future<Either<Failure, Reminder>> createReminder({
    required String title,
    required String body,
    required DateTime remindAt,
    String? url,
  });
  Future<Either<Failure, Reminder>> toggleReminderCompletion(String id, bool isCompleted);
  Future<Either<Failure, void>> deleteReminder(String id);
  Future<Either<Failure, bool>> sendTestPush({String? title, String? body});
}
