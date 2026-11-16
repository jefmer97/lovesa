import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/chat_message.dart';

abstract class AiRepository {
  Future<Either<Failure, List<ChatMessageEntity>>> getHistory();
  Future<Either<Failure, ChatMessageEntity>> sendMessage({
    required String message,
    List<ChatMessageEntity>? history,
  });
  Future<Either<Failure, void>> clearHistory();
}
