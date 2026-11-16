import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/chat_message.dart';
import '../../domain/repositories/ai_repository.dart';
import '../datasources/ai_remote_datasource.dart';
import '../models/chat_message_model.dart';

class AiRepositoryImpl implements AiRepository {
  final AiRemoteDataSource remoteDataSource;

  AiRepositoryImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, List<ChatMessageEntity>>> getHistory() async {
    try {
      final models = await remoteDataSource.getHistory();
      return Right(models);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, ChatMessageEntity>> sendMessage({
    required String message,
    List<ChatMessageEntity>? history,
  }) async {
    try {
      List<ChatMessageModel>? historyModels;
      if (history != null) {
        historyModels = history
            .map((m) => ChatMessageModel(
                  id: m.id,
                  role: m.role,
                  content: m.content,
                  createdAt: m.createdAt,
                ))
            .toList();
      }
      final model = await remoteDataSource.sendMessage(
        message: message,
        history: historyModels,
      );
      return Right(model);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> clearHistory() async {
    try {
      await remoteDataSource.clearHistory();
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
