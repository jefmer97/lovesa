import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/chat_message.dart';
import '../repositories/ai_repository.dart';

class GetAiHistory implements UseCase<List<ChatMessageEntity>, NoParams> {
  final AiRepository repository;

  GetAiHistory(this.repository);

  @override
  Future<Either<Failure, List<ChatMessageEntity>>> call(NoParams params) async {
    return await repository.getHistory();
  }
}
