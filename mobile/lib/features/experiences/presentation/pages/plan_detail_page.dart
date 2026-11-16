import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/activity_plan.dart';
import '../bloc/activity_bloc.dart';
import '../bloc/activity_event.dart';

class PlanDetailPage extends StatefulWidget {
  final ActivityEntity? activity;

  const PlanDetailPage({super.key, this.activity});

  @override
  State<PlanDetailPage> createState() => _PlanDetailPageState();
}

class _PlanDetailPageState extends State<PlanDetailPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  late TextEditingController _titleController;
  late TextEditingController _descController;
  late TextEditingController _motivoController;
  late TextEditingController _imagenMiaController;
  late TextEditingController _halagos1Controller;
  late TextEditingController _objetoController;
  late TextEditingController _reglaController;
  late TextEditingController _lugarSecundarioController;
  late TextEditingController _halagos2Controller;
  late TextEditingController _cierreController;
  late TextEditingController _transporteController;
  late TextEditingController _feedbackController;
  late TextEditingController _memoriasController;

  late String _planType;
  late DateTime _startDate;
  late DateTime _endDate;
  late List<String> _checklist;
  int _rating = 5;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    final act = widget.activity;
    final plan = act?.datePlan;

    _titleController = TextEditingController(text: act?.title ?? '');
    _descController = TextEditingController(text: act?.description ?? '');
    _motivoController = TextEditingController(text: plan?.motivo ?? '');
    _imagenMiaController = TextEditingController(text: plan?.imagenMia ?? '');
    _halagos1Controller = TextEditingController(text: plan?.halagosTension1 ?? '');
    _objetoController = TextEditingController(text: plan?.objeto ?? '');
    _reglaController = TextEditingController(text: plan?.regla ?? '');
    _lugarSecundarioController =
        TextEditingController(text: plan?.lugarSecundario ?? '');
    _halagos2Controller = TextEditingController(text: plan?.halagosTension2 ?? '');
    _cierreController = TextEditingController(text: plan?.cierre ?? '');
    _transporteController = TextEditingController(text: plan?.preTransporte ?? '');
    _feedbackController = TextEditingController(text: plan?.postFeedback ?? '');
    _memoriasController = TextEditingController(text: plan?.postMemorias ?? '');

    _planType = act?.planType ?? 'fuerte';
    _startDate = act?.startDate ?? DateTime.now().add(const Duration(days: 1));
    _endDate = act?.endDate ?? DateTime.now().add(const Duration(days: 1, hours: 4));
    _rating = plan?.rating ?? 5;

    _checklist = plan != null && plan.preMitigacionRiesgos.isNotEmpty
        ? List.from(plan.preMitigacionRiesgos)
        : [
            'Auto con tanque lleno y limpio',
            'Efectivo para peajes y emergencias',
            'Reservación confirmada',
            'Outfit planificado y perfume Dei',
            'Playlist de carretera lista',
          ];
  }

  @override
  void dispose() {
    _tabController.dispose();
    _titleController.dispose();
    _descController.dispose();
    _motivoController.dispose();
    _imagenMiaController.dispose();
    _halagos1Controller.dispose();
    _objetoController.dispose();
    _reglaController.dispose();
    _lugarSecundarioController.dispose();
    _halagos2Controller.dispose();
    _cierreController.dispose();
    _transporteController.dispose();
    _feedbackController.dispose();
    _memoriasController.dispose();
    super.dispose();
  }

  void _savePlan() {
    if (_titleController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Por favor escribe un título para la cita'),
          backgroundColor: Colors.amber,
        ),
      );
      return;
    }

    final newDatePlan = DatePlanEntity(
      motivo: _motivoController.text.trim(),
      imagenMia: _imagenMiaController.text.trim(),
      halagosTension1: _halagos1Controller.text.trim(),
      objeto: _objetoController.text.trim(),
      regla: _reglaController.text.trim(),
      lugarSecundario: _lugarSecundarioController.text.trim(),
      halagosTension2: _halagos2Controller.text.trim(),
      cierre: _cierreController.text.trim(),
      preMitigacionRiesgos: _checklist,
      preTransporte: _transporteController.text.trim(),
      postFeedback: _feedbackController.text.trim(),
      postMemorias: _memoriasController.text.trim(),
      rating: _rating,
    );

    final activity = ActivityEntity(
      id: widget.activity?.id ?? '',
      title: _titleController.text.trim(),
      description: _descController.text.trim(),
      startDate: _startDate,
      endDate: _endDate,
      planType: _planType,
      datePlan: newDatePlan,
    );

    context.read<ActivityBloc>().add(
          SaveActivityEvent(
            activity: activity,
            isEdit: widget.activity != null && widget.activity!.id.isNotEmpty,
          ),
        );

    Navigator.pop(context);
  }

  Widget _buildField({
    required TextEditingController controller,
    required String label,
    required String hint,
    int maxLines = 1,
    IconData? icon,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: TextField(
        controller: controller,
        maxLines: maxLines,
        style: const TextStyle(color: Colors.white, fontSize: 14),
        decoration: InputDecoration(
          prefixIcon: icon != null ? Icon(icon, color: const Color(0xFFE11D48), size: 20) : null,
          labelText: label,
          hintText: hint,
          hintStyle: const TextStyle(color: Colors.white30, fontSize: 13),
          labelStyle: const TextStyle(color: Colors.white70, fontSize: 14),
          filled: true,
          fillColor: const Color(0xFF1E293B),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        title: Text(
          widget.activity == null ? 'Planificar Nueva Cita' : 'Editar Plan Maestro',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.check, color: Color(0xFF10B981)),
            onPressed: _savePlan,
            tooltip: 'Guardar Plan',
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFFE11D48),
          tabs: const [
            Tab(text: '14 Pilares'),
            Tab(text: 'PRE (Riesgos)'),
            Tab(text: 'POST (Feedback)'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // TAB 1: 14 PILARES & PLAN CENTRAL
          ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _buildField(
                controller: _titleController,
                label: 'Título de la Cita / Destino',
                hint: 'ej: Escapada a Cerro Azul en el Auto Nuevo',
                icon: Icons.title,
              ),
              _buildField(
                controller: _descController,
                label: 'Descripción General',
                hint: 'Resumen de la cita y propósito',
                maxLines: 2,
                icon: Icons.notes,
              ),
              const SizedBox(height: 8),
              // Plan Type selector
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Tipo de Experiencia',
                      style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      children: [
                        ChoiceChip(
                          label: const Text('🔥 Fuerte (Aventura/Intensa)'),
                          selected: _planType == 'fuerte',
                          onSelected: (val) => setState(() => _planType = 'fuerte'),
                          selectedColor: const Color(0xFFE11D48),
                        ),
                        ChoiceChip(
                          label: const Text('☕ Suave (Íntima/Relax)'),
                          selected: _planType == 'suave',
                          onSelected: (val) => setState(() => _planType = 'suave'),
                          selectedColor: const Color(0xFF0284C7),
                        ),
                        ChoiceChip(
                          label: const Text('💎 Hito (Aniversario 15)'),
                          selected: _planType == 'hito',
                          onSelected: (val) => setState(() => _planType = 'hito'),
                          selectedColor: const Color(0xFF9333EA),
                        ),
                        ChoiceChip(
                          label: const Text('📸 Recuerdo'),
                          selected: _planType == 'recuerdo',
                          onSelected: (val) => setState(() => _planType = 'recuerdo'),
                          selectedColor: const Color(0xFF10B981),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'LOS PILARES CLAVE (Guía Google Sheets)',
                style: TextStyle(
                  color: Color(0xFFE11D48),
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1,
                ),
              ),
              const SizedBox(height: 8),
              _buildField(
                controller: _motivoController,
                label: '1. Motivo / Storytelling',
                hint: 'La razón especial para sorprender a Dei hoy',
                maxLines: 2,
              ),
              _buildField(
                controller: _imagenMiaController,
                label: '2. Imagen Mía (Presencia & Auto)',
                hint: 'Outfit, perfume favorito, auto lavado e impecable',
              ),
              _buildField(
                controller: _halagos1Controller,
                label: '3. Halagos / Tensión Inicial',
                hint: 'Frase o mirada al recibirla para elevar la química',
              ),
              _buildField(
                controller: _objetoController,
                label: '4. Objeto / Detalle Sorpresa',
                hint: 'Flores, dulce favorito, amuleto o cartita',
              ),
              _buildField(
                controller: _reglaController,
                label: '5. Regla del Juego / Dinámica',
                hint: 'ej: Sin mirar celulares durante la cena, preguntas pícaras',
              ),
              _buildField(
                controller: _lugarSecundarioController,
                label: '6. Lugar Secundario / Cambio de Escenario',
                hint: 'Lugar B para romper monotonía (ej: mirador nocturno)',
              ),
              _buildField(
                controller: _halagos2Controller,
                label: '7. Halagos / Tensión Secundaria',
                hint: 'Intensificar intimidad en el auto o lugar secundario',
              ),
              _buildField(
                controller: _cierreController,
                label: '8. Cierre & Recuerdo Memorable',
                hint: 'Cómo despedir la velada o conectar con la siguiente',
              ),
              const SizedBox(height: 24),
            ],
          ),

          // TAB 2: PRE-DAY (RIESGOS & CHECKLIST)
          ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _buildField(
                controller: _transporteController,
                label: 'Transporte & Ruta (Waze / Auto)',
                hint: 'Ruta hacia Cerro Azul, peajes Panamericana Sur, etc.',
                icon: Icons.directions_car,
              ),
              const SizedBox(height: 16),
              const Text(
                'Mitigación de Riesgos (Checklist de Seguridad)',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'El Director AI supervisa este checklist y te alertará por Push si falta algo antes de salir.',
                style: TextStyle(color: Colors.white60, fontSize: 12),
              ),
              const SizedBox(height: 12),
              ..._checklist.map((item) {
                return Card(
                  color: const Color(0xFF1E293B),
                  margin: const EdgeInsets.symmetric(vertical: 4),
                  child: ListTile(
                    leading: const Icon(Icons.check_box_outlined, color: Color(0xFFE11D48)),
                    title: Text(item, style: const TextStyle(color: Colors.white)),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete_outline, color: Colors.white38),
                      onPressed: () {
                        setState(() {
                          _checklist.remove(item);
                        });
                      },
                    ),
                  ),
                );
              }),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                onPressed: () {
                  final textController = TextEditingController();
                  showDialog(
                    context: context,
                    builder: (ctx) => AlertDialog(
                      backgroundColor: const Color(0xFF1E293B),
                      title: const Text('Nuevo ítem de checklist', style: TextStyle(color: Colors.white)),
                      content: TextField(
                        controller: textController,
                        style: const TextStyle(color: Colors.white),
                        decoration: const InputDecoration(
                          hintText: 'ej: Revisar presión de llantas',
                          hintStyle: TextStyle(color: Colors.white30),
                        ),
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(ctx),
                          child: const Text('Cancelar'),
                        ),
                        ElevatedButton(
                          onPressed: () {
                            if (textController.text.trim().isNotEmpty) {
                              setState(() {
                                _checklist.add(textController.text.trim());
                              });
                              Navigator.pop(ctx);
                            }
                          },
                          child: const Text('Agregar'),
                        ),
                      ],
                    ),
                  );
                },
                icon: const Icon(Icons.add, color: Color(0xFFE11D48)),
                label: const Text('Agregar tarea de mitigación', style: TextStyle(color: Colors.white)),
              ),
            ],
          ),

          // TAB 3: POST-DAY (FEEDBACK & RATING)
          ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    const Text(
                      'Calificación de la Cita',
                      style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(5, (index) {
                        return IconButton(
                          icon: Icon(
                            index < _rating ? Icons.star : Icons.star_border,
                            color: Colors.amber,
                            size: 32,
                          ),
                          onPressed: () {
                            setState(() {
                              _rating = index + 1;
                            });
                          },
                        );
                      }),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              _buildField(
                controller: _feedbackController,
                label: 'Feedback de Dei',
                hint: '¿Qué le encantó? ¿Qué detalles podemos mejorar?',
                maxLines: 3,
                icon: Icons.favorite,
              ),
              _buildField(
                controller: _memoriasController,
                label: 'Momentos Memorables para el Diario',
                hint: 'Anécdotas divertidas, risas en el auto, fotos tomadas',
                maxLines: 3,
                icon: Icons.auto_stories,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
