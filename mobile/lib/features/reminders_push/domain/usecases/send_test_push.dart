import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/reminder_repository.dart';

class SendTestPushParams extends Equatable {
  final String? title;
  final String? body;

  const SendTestPushParams({this.title, this.body});

  @override
  List<Object?> get props => [title, body];
}

class SendTestPush implements UseCase<bool, SendTestPushParams> {
  final ReminderRepository repository;

  SendTestPush(this.repository);

  @override
  Future<Either<Failure, bool>> call(SendTestPushParams params) async {
    return await repository.sendTestPush(
      title: params.title,
      body: params.body,
    );
  }
}
