import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/usecases/get_activities.dart';
import '../../domain/usecases/save_activity.dart';
import '../../domain/repositories/activity_repository.dart';
import 'activity_event.dart';
import 'activity_state.dart';

class ActivityBloc extends Bloc<ActivityEvent, ActivityState> {
  final GetActivities getActivities;
  final SaveActivity saveActivity;
  final ActivityRepository repository;

  ActivityBloc({
    required this.getActivities,
    required this.saveActivity,
    required this.repository,
  }) : super(ActivityInitial()) {
    on<LoadActivitiesEvent>(_onLoadActivities);
    on<SaveActivityEvent>(_onSaveActivity);
    on<DeleteActivityEvent>(_onDeleteActivity);
  }

  Future<void> _onLoadActivities(
    LoadActivitiesEvent event,
    Emitter<ActivityState> emit,
  ) async {
    emit(ActivityLoading());
    final result = await getActivities(GetActivitiesParams(search: event.search));
    result.fold(
      (failure) => emit(ActivityError(message: failure.message)),
      (activities) => emit(ActivityLoaded(activities: activities)),
    );
  }

  Future<void> _onSaveActivity(
    SaveActivityEvent event,
    Emitter<ActivityState> emit,
  ) async {
    final result = await saveActivity(SaveActivityParams(
      activity: event.activity,
      isEdit: event.isEdit,
    ));

    result.fold(
      (failure) => emit(ActivityError(message: failure.message)),
      (saved) {
        if (state is ActivityLoaded) {
          final current = (state as ActivityLoaded).activities;
          List<dynamic> updated;
          if (event.isEdit) {
            updated = current.map((a) => a.id == saved.id ? saved : a).toList();
          } else {
            updated = [saved, ...current];
          }
          emit(ActivityLoaded(
            activities: updated.cast(),
            message: event.isEdit ? 'Cita actualizada' : 'Cita planificada con éxito',
          ));
        } else {
          emit(ActivityLoaded(
            activities: [saved],
            message: 'Cita planificada con éxito',
          ));
        }
      },
    );
  }

  Future<void> _onDeleteActivity(
    DeleteActivityEvent event,
    Emitter<ActivityState> emit,
  ) async {
    final result = await repository.deleteActivity(event.id);
    result.fold(
      (failure) => emit(ActivityError(message: failure.message)),
      (_) {
        if (state is ActivityLoaded) {
          final current = (state as ActivityLoaded).activities;
          final updated = current.where((a) => a.id != event.id).toList();
          emit(ActivityLoaded(activities: updated, message: 'Plan eliminado'));
        }
      },
    );
  }
}
