import 'package:equatable/equatable.dart';
import '../../domain/entities/activity_plan.dart';

abstract class ActivityEvent extends Equatable {
  const ActivityEvent();

  @override
  List<Object?> get props => [];
}

class LoadActivitiesEvent extends ActivityEvent {
  final String? search;

  const LoadActivitiesEvent({this.search});

  @override
  List<Object?> get props => [search];
}

class SaveActivityEvent extends ActivityEvent {
  final ActivityEntity activity;
  final bool isEdit;

  const SaveActivityEvent({required this.activity, this.isEdit = false});

  @override
  List<Object?> get props => [activity, isEdit];
}

class DeleteActivityEvent extends ActivityEvent {
  final String id;

  const DeleteActivityEvent(this.id);

  @override
  List<Object?> get props => [id];
}
