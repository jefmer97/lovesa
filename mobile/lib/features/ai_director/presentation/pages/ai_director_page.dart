import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/ai_bloc.dart';
import '../bloc/ai_event.dart';
import '../bloc/ai_state.dart';

class AiDirectorPage extends StatefulWidget {
  const AiDirectorPage({super.key});

  @override
  State<AiDirectorPage> createState() => _AiDirectorPageState();
}

class _AiDirectorPageState extends State<AiDirectorPage> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = TextEditingController() as dynamic;

  final List<String> _suggestions = [
    'Planear cita fuerte a Cerro Azul en el auto nuevo',
    'Sorpresa para nuestro aniversario del día 15',
    'Recomiéndame una cita suave y relajante para el miércoles',
    'Frases y halagos para romper el hielo hoy con Dei',
    'Checklist de mitigación de riesgos para viaje',
  ];

  @override
  void initState() {
    super.initState();
    context.read<AiBloc>().add(LoadAiHistoryEvent());
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  void _sendMessage([String? customText]) {
    final text = customText ?? _messageController.text.trim();
    if (text.isEmpty) return;
    context.read<AiBloc>().add(SendUserMessageEvent(text));
    _messageController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: const Color(0xFFE11D48).withOpacity(0.2),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.auto_awesome, color: Color(0xFFE11D48), size: 20),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  'Director AI',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Text(
                  'Gemini 3.8 Flash • Copiloto de Pareja',
                  style: TextStyle(fontSize: 11, color: Colors.white54),
                ),
              ],
            ),
          ],
        ),
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_sweep, color: Colors.white60),
            tooltip: 'Limpiar conversación',
            onPressed: () {
              context.read<AiBloc>().add(ClearAiHistoryEvent());
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // SUGGESTION PILLS
          Container(
            height: 48,
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              scrollDirection: Axis.horizontal,
              itemCount: _suggestions.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final suggestion = _suggestions[index];
                return ActionChip(
                  label: Text(
                    suggestion,
                    style: const TextStyle(fontSize: 12, color: Colors.white),
                  ),
                  backgroundColor: const Color(0xFF1E293B),
                  side: BorderSide(color: const Color(0xFFE11D48).withOpacity(0.3)),
                  onPressed: () => _sendMessage(suggestion),
                );
              },
            ),
          ),
          const Divider(height: 1, color: Colors.white12),

          // CHAT MESSAGES
          Expanded(
            child: BlocConsumer<AiBloc, AiState>(
              listener: (context, state) {
                if (state is AiLoaded && state.errorMessage != null) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(state.errorMessage!),
                      backgroundColor: Colors.redAccent,
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                }
              },
              builder: (context, state) {
                if (state is AiLoadingHistory) {
                  return const Center(child: CircularProgressIndicator(color: Color(0xFFE11D48)));
                }

                final messages = state is AiLoaded ? state.messages : [];
                final isThinking = state is AiLoaded && state.isThinking;

                if (messages.isEmpty && !isThinking) {
                  return Center(
                    child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Icon(Icons.favorite_border, size: 56, color: Color(0xFFE11D48)),
                          SizedBox(height: 16),
                          Text(
                            '¡Hola Dei y Jef!',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Soy tu Director AI con Gemini 3.8 Flash. Estoy aquí para ayudarte a planificar citas inolvidables, recordar los aniversarios y coordinar cada detalle de tus escapadas.',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white60, fontSize: 13, height: 1.4),
                          ),
                        ],
                      ),
                    ),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: messages.length + (isThinking ? 1 : 0),
                  itemBuilder: (context, index) {
                    if (index == messages.length && isThinking) {
                      return Align(
                        alignment: Alignment.centerLeft,
                        child: Container(
                          margin: const EdgeInsets.symmetric(vertical: 6),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E293B),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: const [
                              SizedBox(
                                width: 14,
                                height: 14,
                                child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFFE11D48)),
                              ),
                              SizedBox(width: 10),
                              Text(
                                'Director AI pensando...',
                                style: TextStyle(color: Colors.white60, fontSize: 12),
                              ),
                            ],
                          ),
                        ),
                      );
                    }

                    final msg = messages[index];
                    final isUser = msg.role == 'user';

                    return Align(
                      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.symmetric(vertical: 6),
                        padding: const EdgeInsets.all(14),
                        constraints: BoxConstraints(
                          maxWidth: MediaQuery.of(context).size.width * 0.78,
                        ),
                        decoration: BoxDecoration(
                          color: isUser ? const Color(0xFFE11D48) : const Color(0xFF1E293B),
                          borderRadius: BorderRadius.circular(16).copyWith(
                            bottomRight: isUser ? const Radius.circular(0) : const Radius.circular(16),
                            bottomLeft: !isUser ? const Radius.circular(0) : const Radius.circular(16),
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 4,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Text(
                          msg.content,
                          style: const TextStyle(color: Colors.white, fontSize: 14, height: 1.4),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),

          // INPUT BAR
          Container(
            padding: const EdgeInsets.all(12),
            color: const Color(0xFF1E293B),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      style: const TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        hintText: 'Pregúntale a tu Director AI...',
                        hintStyle: const TextStyle(color: Colors.white38),
                        filled: true,
                        fillColor: const Color(0xFF0F172A),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onSubmitted: (_) => _sendMessage(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  CircleAvatar(
                    backgroundColor: const Color(0xFFE11D48),
                    child: IconButton(
                      icon: const Icon(Icons.send, color: Colors.white, size: 18),
                      onPressed: () => _sendMessage(),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
