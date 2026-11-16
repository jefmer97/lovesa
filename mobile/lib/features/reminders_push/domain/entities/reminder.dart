import 'package:equatable/equatable.dart';

class Reminder extends Equatable {
  final String id;
  final String title;
  final String body;
  final DateTime remindAt;
  final bool isCompleted;
  final bool sent;
  final String url;

  const Reminder({
    required this.id,
    required this.title,
    required this.body,
    required this.remindAt,
    this.isCompleted = false,
    this.sent = false,
    this.url = '/timeline',
  });

  Reminder copyWith({
    String? id,
    String? title,
    String? body,
    DateTime? remindAt,
    bool? isCompleted,
    bool? sent,
    String? url,
  }) {
    return Reminder(
      id: id ?? this.id,
      title: title ?? this.title,
      body: body ?? this.body,
      remindAt: remindAt ?? this.remindAt,
      isCompleted: isCompleted ?? this.isCompleted,
      sent: sent ?? this.sent,
      url: url ?? this.url,
    );
  }

  @override
  List<Object?> get props => [id, title, body, remindAt, isCompleted, sent, url];
}
