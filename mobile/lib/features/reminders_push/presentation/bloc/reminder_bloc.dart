import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/usecases/usecase.dart';
import '../../domain/usecases/get_reminders.dart';
import '../../domain/usecases/create_reminder.dart';
import '../../domain/usecases/toggle_reminder.dart';
import '../../domain/usecases/send_test_push.dart';
import 'reminder_event.dart';
import 'reminder_state.dart';

class ReminderBloc extends Bloc<ReminderEvent, ReminderState> {
  final GetReminders getReminders;
  final CreateReminder createReminder;
  final ToggleReminder toggleReminder;
  final SendTestPush sendTestPush;

  ReminderBloc({
    required this.getReminders,
    required this.createReminder,
    required this.toggleReminder,
    required this.sendTestPush,
  }) : super(ReminderInitial()) {
    on<LoadRemindersEvent>(_onLoadReminders);
    on<CreateReminderEvent>(_onCreateReminder);
    on<ToggleReminderEvent>(_onToggleReminder);
    on<TriggerTestPushEvent>(_onTriggerTestPush);
  }

  Future<void> _onLoadReminders(
    LoadRemindersEvent event,
    Emitter<ReminderState> emit,
  ) async {
    emit(ReminderLoading());
    final result = await getReminders(NoParams());
    result.fold(
      (failure) => emit(ReminderError(message: failure.message)),
      (reminders) => emit(ReminderLoaded(reminders: reminders)),
    );
  }

  Future<void> _onCreateReminder(
    CreateReminderEvent event,
    Emitter<ReminderState> emit,
  ) async {
    final result = await createReminder(CreateReminderParams(
      title: event.title,
      body: event.body,
      remindAt: event.remindAt,
    ));

    result.fold(
      (failure) => emit(ReminderError(message: failure.message)),
      (newReminder) {
        if (state is ReminderLoaded) {
          final current = (state as ReminderLoaded).reminders;
          emit(ReminderLoaded(
            reminders: [newReminder, ...current],
            notificationMessage: 'Recordatorio creado exitosamente',
          ));
        } else {
          emit(ReminderLoaded(
            reminders: [newReminder],
            notificationMessage: 'Recordatorio creado exitosamente',
          ));
        }
      },
    );
  }

  Future<void> _onToggleReminder(
    ToggleReminderEvent event,
    Emitter<ReminderState> emit,
  ) async {
    final result = await toggleReminder(ToggleReminderParams(
      id: event.id,
      isCompleted: event.isCompleted,
    ));

    result.fold(
      (failure) => emit(ReminderError(message: failure.message)),
      (updated) {
        if (state is ReminderLoaded) {
          final current = (state as ReminderLoaded).reminders;
          final updatedList = current.map((r) => r.id == updated.id ? updated : r).toList();
          emit((state as ReminderLoaded).copyWith(reminders: updatedList));
        }
      },
    );
  }

  Future<void> _onTriggerTestPush(
    TriggerTestPushEvent event,
    Emitter<ReminderState> emit,
  ) async {
    final result = await sendTestPush(SendTestPushParams(
      title: event.title,
      body: event.body,
    ));

    result.fold(
      (failure) => emit(ReminderError(message: failure.message)),
      (_) {
        if (state is ReminderLoaded) {
          emit((state as ReminderLoaded).copyWith(
            notificationMessage: '¡Notificación Push enviada a tu dispositivo!',
          ));
        }
      },
    );
  }
}
