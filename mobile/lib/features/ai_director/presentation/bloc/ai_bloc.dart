import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/usecases/usecase.dart';
import '../../domain/entities/chat_message.dart';
import '../../domain/usecases/get_ai_history.dart';
import '../../domain/usecases/send_ai_message.dart';
import '../../domain/repositories/ai_repository.dart';
import 'ai_event.dart';
import 'ai_state.dart';

class AiBloc extends Bloc<AiEvent, AiState> {
  final GetAiHistory getAiHistory;
  final SendAiMessage sendAiMessage;
  final AiRepository repository;

  AiBloc({
    required this.getAiHistory,
    required this.sendAiMessage,
    required this.repository,
  }) : super(AiInitial()) {
    on<LoadAiHistoryEvent>(_onLoadHistory);
    on<SendUserMessageEvent>(_onSendMessage);
    on<ClearAiHistoryEvent>(_onClearHistory);
  }

  Future<void> _onLoadHistory(
    LoadAiHistoryEvent event,
    Emitter<AiState> emit,
  ) async {
    emit(AiLoadingHistory());
    final result = await getAiHistory(NoParams());
    result.fold(
      (failure) => emit(AiLoaded(messages: const [], errorMessage: failure.message)),
      (history) => emit(AiLoaded(messages: history)),
    );
  }

  Future<void> _onSendMessage(
    SendUserMessageEvent event,
    Emitter<AiState> emit,
  ) async {
    final currentMessages = state is AiLoaded ? (state as AiLoaded).messages : <ChatMessageEntity>[];

    final userMessage = ChatMessageEntity(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      role: 'user',
      content: event.message,
      createdAt: DateTime.now(),
    );

    final updatedWithUser = [...currentMessages, userMessage];
    emit(AiLoaded(messages: updatedWithUser, isThinking: true));

    final result = await sendAiMessage(SendAiMessageParams(
      message: event.message,
      history: updatedWithUser,
    ));

    result.fold(
      (failure) {
        emit(AiLoaded(
          messages: updatedWithUser,
          isThinking: false,
          errorMessage: failure.message,
        ));
      },
      (aiResponse) {
        emit(AiLoaded(
          messages: [...updatedWithUser, aiResponse],
          isThinking: false,
        ));
      },
    );
  }

  Future<void> _onClearHistory(
    ClearAiHistoryEvent event,
    Emitter<AiState> emit,
  ) async {
    await repository.clearHistory();
    emit(const AiLoaded(messages: []));
  }
}
