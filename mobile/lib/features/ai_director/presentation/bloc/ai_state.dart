import 'package:equatable/equatable.dart';
import '../../domain/entities/chat_message.dart';

abstract class AiState extends Equatable {
  const AiState();

  @override
  List<Object?> get props => [];
}

class AiInitial extends AiState {}

class AiLoadingHistory extends AiState {}

class AiLoaded extends AiState {
  final List<ChatMessageEntity> messages;
  final bool isThinking;
  final String? errorMessage;

  const AiLoaded({
    required this.messages,
    this.isThinking = false,
    this.errorMessage,
  });

  AiLoaded copyWith({
    List<ChatMessageEntity>? messages,
    bool? isThinking,
    String? errorMessage,
  }) {
    return AiLoaded(
      messages: messages ?? this.messages,
      isThinking: isThinking ?? this.isThinking,
      errorMessage: errorMessage,
    );
  }

  @override
  List<Object?> get props => [messages, isThinking, errorMessage];
}
