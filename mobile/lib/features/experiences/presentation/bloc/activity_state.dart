import 'package:equatable/equatable.dart';
import '../../domain/entities/activity_plan.dart';

abstract class ActivityState extends Equatable {
  const ActivityState();

  @override
  List<Object?> get props => [];
}

class ActivityInitial extends ActivityState {}

class ActivityLoading extends ActivityState {}

class ActivityLoaded extends ActivityState {
  final List<ActivityEntity> activities;
  final String? message;

  const ActivityLoaded({required this.activities, this.message});

  ActivityLoaded copyWith({
    List<ActivityEntity>? activities,
    String? message,
  }) {
    return ActivityLoaded(
      activities: activities ?? this.activities,
      message: message,
    );
  }

  @override
  List<Object?> get props => [activities, message];
}

class ActivityError extends ActivityState {
  final String message;

  const ActivityError({required this.message});

  @override
  List<Object?> get props => [message];
}
