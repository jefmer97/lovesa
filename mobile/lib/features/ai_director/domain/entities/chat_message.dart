import 'package:equatable/equatable.dart';

class ChatMessageEntity extends Equatable {
  final String id;
  final String role; // 'user' or 'model'
  final String content;
  final DateTime createdAt;

  const ChatMessageEntity({
    required this.id,
    required this.role,
    required this.content,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [id, role, content, createdAt];
}
