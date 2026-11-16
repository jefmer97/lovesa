import 'package:equatable/equatable.dart';

abstract class ReminderEvent extends Equatable {
  const ReminderEvent();

  @override
  List<Object?> get props => [];
}

class LoadRemindersEvent extends ReminderEvent {}

class CreateReminderEvent extends ReminderEvent {
  final String title;
  final String body;
  final DateTime remindAt;

  const CreateReminderEvent({
    required this.title,
    required this.body,
    required this.remindAt,
  });

  @override
  List<Object?> get props => [title, body, remindAt];
}

class ToggleReminderEvent extends ReminderEvent {
  final String id;
  final bool isCompleted;

  const ToggleReminderEvent({required this.id, required this.isCompleted});

  @override
  List<Object?> get props => [id, isCompleted];
}

class TriggerTestPushEvent extends ReminderEvent {
  final String? title;
  final String? body;

  const TriggerTestPushEvent({this.title, this.body});

  @override
  List<Object?> get props => [title, body];
}
