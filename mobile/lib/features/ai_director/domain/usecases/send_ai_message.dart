import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/chat_message.dart';
import '../repositories/ai_repository.dart';

class SendAiMessageParams extends Equatable {
  final String message;
  final List<ChatMessageEntity>? history;

  const SendAiMessageParams({required this.message, this.history});

  @override
  List<Object?> get props => [message, history];
}

class SendAiMessage implements UseCase<ChatMessageEntity, SendAiMessageParams> {
  final AiRepository repository;

  SendAiMessage(this.repository);

  @override
  Future<Either<Failure, ChatMessageEntity>> call(SendAiMessageParams params) async {
    return await repository.sendMessage(
      message: params.message,
      history: params.history,
    );
  }
}
