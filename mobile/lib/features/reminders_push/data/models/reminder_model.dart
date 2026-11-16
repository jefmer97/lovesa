import '../../domain/entities/reminder.dart';

class ReminderModel extends Reminder {
  const ReminderModel({
    required super.id,
    required super.title,
    required super.body,
    required super.remindAt,
    super.isCompleted,
    super.sent,
    super.url,
  });

  factory ReminderModel.fromJson(Map<String, dynamic> json) {
    return ReminderModel(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      body: json['body'] ?? '',
      remindAt: json['remindAt'] != null
          ? DateTime.tryParse(json['remindAt'].toString()) ?? DateTime.now()
          : DateTime.now(),
      isCompleted: json['isCompleted'] ?? false,
      sent: json['sent'] ?? false,
      url: json['url'] ?? '/timeline',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'body': body,
      'remindAt': remindAt.toIso8601String(),
      'isCompleted': isCompleted,
      'sent': sent,
      'url': url,
    };
  }
}
