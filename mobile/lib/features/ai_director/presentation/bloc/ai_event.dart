import 'package:equatable/equatable.dart';

abstract class AiEvent extends Equatable {
  const AiEvent();

  @override
  List<Object?> get props => [];
}

class LoadAiHistoryEvent extends AiEvent {}

class SendUserMessageEvent extends AiEvent {
  final String message;

  const SendUserMessageEvent(this.message);

  @override
  List<Object?> get props => [message];
}

class ClearAiHistoryEvent extends AiEvent {}
