import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/reminder.dart';
import '../../domain/repositories/reminder_repository.dart';
import '../datasources/reminder_remote_datasource.dart';

class ReminderRepositoryImpl implements ReminderRepository {
  final ReminderRemoteDataSource remoteDataSource;

  ReminderRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, List<Reminder>>> getReminders() async {
    try {
      final models = await remoteDataSource.getReminders();
      return Right(models);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, Reminder>> createReminder({
    required String title,
    required String body,
    required DateTime remindAt,
    String? url,
  }) async {
    try {
      final model = await remoteDataSource.createReminder({
        'title': title,
        'body': body,
        'remindAt': remindAt.toIso8601String(),
        'url': url ?? '/timeline',
      });
      return Right(model);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, Reminder>> toggleReminderCompletion(String id, bool isCompleted) async {
    try {
      final model = await remoteDataSource.updateReminder(id, {
        'isCompleted': isCompleted,
      });
      return Right(model);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> deleteReminder(String id) async {
    try {
      await remoteDataSource.deleteReminder(id);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, bool>> sendTestPush({String? title, String? body}) async {
    try {
      final success = await remoteDataSource.sendTestPush(title: title, body: body);
      return Right(success);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
