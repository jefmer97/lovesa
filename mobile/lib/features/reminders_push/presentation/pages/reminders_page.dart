import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/reminder_bloc.dart';
import '../bloc/reminder_event.dart';
import '../bloc/reminder_state.dart';
import '../widgets/anniversary_banner_card.dart';

class RemindersPage extends StatefulWidget {
  final VoidCallback onNavigateToPlanDate;

  const RemindersPage({super.key, required this.onNavigateToPlanDate});

  @override
  State<RemindersPage> createState() => _RemindersPageState();
}

class _RemindersPageState extends State<RemindersPage> {
  @override
  void initState() {
    super.initState();
    context.read<ReminderBloc>().add(LoadRemindersEvent());
  }

  void _showAddReminderDialog(BuildContext context) {
    final titleController = TextEditingController();
    final bodyController = TextEditingController();
    DateTime selectedDate = DateTime.now().add(const Duration(hours: 4));

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (sheetContext) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(sheetContext).viewInsets.bottom + 20,
            left: 20,
            right: 20,
            top: 20,
          ),
          decoration: const BoxDecoration(
            color: Color(0xFF1E293B),
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Nuevo Recordatorio / Alerta',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(sheetContext),
                    icon: const Icon(Icons.close, color: Colors.white70),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextField(
                controller: titleController,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  labelText: 'Título (ej: Comprar flores día 13, Reservar)',
                  labelStyle: const TextStyle(color: Colors.white70),
                  filled: true,
                  fillColor: const Color(0xFF0F172A),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: bodyController,
                maxLines: 2,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  labelText: 'Detalles (opcional)',
                  labelStyle: const TextStyle(color: Colors.white70),
                  filled: true,
                  fillColor: const Color(0xFF0F172A),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 16),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.calendar_today, color: Color(0xFFE11D48)),
                title: const Text('Fecha y Hora de Alerta', style: TextStyle(color: Colors.white)),
                subtitle: Text(
                  '${selectedDate.day}/${selectedDate.month}/${selectedDate.year} ${selectedDate.hour.toString().padLeft(2, '0')}:${selectedDate.minute.toString().padLeft(2, '0')}',
                  style: const TextStyle(color: Colors.white70),
                ),
                trailing: TextButton(
                  onPressed: () async {
                    final pickedDate = await showDatePicker(
                      context: context,
                      initialDate: selectedDate,
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );
                    if (pickedDate != null) {
                      final pickedTime = await showTimePicker(
                        context: context,
                        initialTime: TimeOfDay.fromDateTime(selectedDate),
                      );
                      if (pickedTime != null) {
                        setModalState(() {
                          selectedDate = DateTime(
                            pickedDate.year,
                            pickedDate.month,
                            pickedDate.day,
                            pickedTime.hour,
                            pickedTime.minute,
                          );
                        });
                      }
                    }
                  },
                  child: const Text('Cambiar', style: TextStyle(color: Color(0xFFE11D48))),
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    if (titleController.text.trim().isEmpty) return;
                    this.context.read<ReminderBloc>().add(
                          CreateReminderEvent(
                            title: titleController.text.trim(),
                            body: bodyController.text.trim(),
                            remindAt: selectedDate,
                          ),
                        );
                    Navigator.pop(sheetContext);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFE11D48),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text(
                    'Programar Recordatorio Push',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        title: const Text(
          'Recordatorios & Push',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        actions: [
          IconButton(
            tooltip: 'Probar Notificación Push',
            icon: const Icon(Icons.send_to_mobile, color: Color(0xFFE11D48)),
            onPressed: () {
              context.read<ReminderBloc>().add(
                    const TriggerTestPushEvent(
                      title: '🔔 Alerta de Prueba — Lovesa',
                      body: '¡Todo listo! Tus alertas de aniversario del día 15 y citas funcionan.',
                    ),
                  );
            },
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFFE11D48),
        onPressed: () => _showAddReminderDialog(context),
        child: const Icon(Icons.add_alert, color: Colors.white),
      ),
      body: BlocConsumer<ReminderBloc, ReminderState>(
        listener: (context, state) {
          if (state is ReminderLoaded && state.notificationMessage != null) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.notificationMessage!),
                backgroundColor: const Color(0xFF059669),
                behavior: SnackBarBehavior.floating,
              ),
            );
          } else if (state is ReminderError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.redAccent,
                behavior: SnackBarBehavior.floating,
              ),
            );
          }
        },
        builder: (context, state) {
          return RefreshIndicator(
            onRefresh: () async {
              context.read<ReminderBloc>().add(LoadRemindersEvent());
            },
            child: ListView(
              children: [
                AnniversaryBannerCard(
                  onPlanDate: widget.onNavigateToPlanDate,
                  onTestPush: () {
                    context.read<ReminderBloc>().add(
                          const TriggerTestPushEvent(
                            title: '❤️ Cuenta Regresiva de Aniversario',
                            body: 'El día 15 se acerca. El Director AI te enviará el recordatorio previo.',
                          ),
                        );
                  },
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Alertas Activas y Checklist',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      if (state is ReminderLoading)
                        const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFFE11D48)),
                        ),
                    ],
                  ),
                ),
                if (state is ReminderLoaded && state.reminders.isEmpty)
                  Container(
                    margin: const EdgeInsets.all(24),
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      children: const [
                        Icon(Icons.notifications_none, size: 48, color: Colors.white38),
                        SizedBox(height: 12),
                        Text(
                          'No hay recordatorios pendientes',
                          style: TextStyle(color: Colors.white70, fontSize: 15),
                        ),
                        SizedBox(height: 6),
                        Text(
                          'Las alertas automáticas del día 15 y tareas de citas se generarán solas.',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.white38, fontSize: 12),
                        ),
                      ],
                    ),
                  )
                else if (state is ReminderLoaded)
                  ...state.reminders.map((reminder) {
                    return Container(
                      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: reminder.isCompleted
                              ? Colors.white10
                              : const Color(0xFFE11D48).withOpacity(0.3),
                        ),
                      ),
                      child: ListTile(
                        leading: IconButton(
                          icon: Icon(
                            reminder.isCompleted
                                ? Icons.check_circle
                                : Icons.radio_button_unchecked,
                            color: reminder.isCompleted
                                ? const Color(0xFF10B981)
                                : const Color(0xFFE11D48),
                          ),
                          onPressed: () {
                            context.read<ReminderBloc>().add(
                                  ToggleReminderEvent(
                                    id: reminder.id,
                                    isCompleted: !reminder.isCompleted,
                                  ),
                                );
                          },
                        ),
                        title: Text(
                          reminder.title,
                          style: TextStyle(
                            color: reminder.isCompleted ? Colors.white38 : Colors.white,
                            decoration: reminder.isCompleted
                                ? TextDecoration.lineThrough
                                : TextDecoration.none,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (reminder.body.isNotEmpty)
                              Text(
                                reminder.body,
                                style: const TextStyle(color: Colors.white60, fontSize: 13),
                              ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                const Icon(Icons.access_time, size: 12, color: Colors.white38),
                                const SizedBox(width: 4),
                                Text(
                                  '${reminder.remindAt.day}/${reminder.remindAt.month}/${reminder.remindAt.year} ${reminder.remindAt.hour.toString().padLeft(2, '0')}:${reminder.remindAt.minute.toString().padLeft(2, '0')}',
                                  style: const TextStyle(color: Colors.white38, fontSize: 11),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  })
                else if (state is ReminderInitial || state is ReminderLoading)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.all(40),
                      child: CircularProgressIndicator(color: Color(0xFFE11D48)),
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
}
