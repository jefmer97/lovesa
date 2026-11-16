import 'package:equatable/equatable.dart';
import '../../domain/entities/reminder.dart';

abstract class ReminderState extends Equatable {
  const ReminderState();

  @override
  List<Object?> get props => [];
}

class ReminderInitial extends ReminderState {}

class ReminderLoading extends ReminderState {}

class ReminderLoaded extends ReminderState {
  final List<Reminder> reminders;
  final String? notificationMessage;

  const ReminderLoaded({
    required this.reminders,
    this.notificationMessage,
  });

  ReminderLoaded copyWith({
    List<Reminder>? reminders,
    String? notificationMessage,
  }) {
    return ReminderLoaded(
      reminders: reminders ?? this.reminders,
      notificationMessage: notificationMessage,
    );
  }

  @override
  List<Object?> get props => [reminders, notificationMessage];
}

class ReminderError extends ReminderState {
  final String message;

  const ReminderError({required this.message});

  @override
  List<Object?> get props => [message];
}
