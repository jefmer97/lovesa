import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/activity_plan.dart';
import '../bloc/activity_bloc.dart';
import '../bloc/activity_event.dart';
import '../bloc/activity_state.dart';
import 'plan_detail_page.dart';

class ExperiencesPage extends StatefulWidget {
  const ExperiencesPage({super.key});

  @override
  State<ExperiencesPage> createState() => _ExperiencesPageState();
}

class _ExperiencesPageState extends State<ExperiencesPage> {
  String _selectedFilter = 'todas';
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    context.read<ActivityBloc>().add(const LoadActivitiesEvent());
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Color _getBadgeColor(String planType) {
    switch (planType) {
      case 'fuerte':
        return const Color(0xFFE11D48);
      case 'suave':
        return const Color(0xFF0284C7);
      case 'hito':
        return const Color(0xFF9333EA);
      case 'recuerdo':
        return const Color(0xFF10B981);
      default:
        return const Color(0xFFE11D48);
    }
  }

  String _getBadgeLabel(String planType) {
    switch (planType) {
      case 'fuerte':
        return '🔥 Cita Fuerte';
      case 'suave':
        return '☕ Cita Suave';
      case 'hito':
        return '💎 Hito / Aniversario';
      case 'recuerdo':
        return '📸 Recuerdo';
      default:
        return 'Plan';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        title: const Text(
          'Experiencias & Citas',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              context.read<ActivityBloc>().add(LoadActivitiesEvent(search: _searchController.text));
            },
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFFE11D48),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Nueva Cita', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const PlanDetailPage()),
          );
        },
      ),
      body: Column(
        children: [
          // SEARCH & FILTER BAR
          Container(
            padding: const EdgeInsets.all(16),
            color: const Color(0xFF1E293B),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    hintText: 'Buscar citas, lugares o planes...',
                    hintStyle: const TextStyle(color: Colors.white38),
                    prefixIcon: const Icon(Icons.search, color: Colors.white54, size: 20),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear, color: Colors.white54, size: 18),
                            onPressed: () {
                              _searchController.clear();
                              context.read<ActivityBloc>().add(const LoadActivitiesEvent());
                            },
                          )
                        : null,
                    filled: true,
                    fillColor: const Color(0xFF0F172A),
                    contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 16),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  onSubmitted: (val) {
                    context.read<ActivityBloc>().add(LoadActivitiesEvent(search: val));
                  },
                ),
                const SizedBox(height: 12),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _buildFilterChip('todas', 'Todas'),
                      const SizedBox(width: 8),
                      _buildFilterChip('fuerte', '🔥 Fuertes'),
                      const SizedBox(width: 8),
                      _buildFilterChip('suave', '☕ Suaves'),
                      const SizedBox(width: 8),
                      _buildFilterChip('hito', '💎 Aniversarios'),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // LIST OF EXPERIENCES
          Expanded(
            child: BlocConsumer<ActivityBloc, ActivityState>(
              listener: (context, state) {
                if (state is ActivityLoaded && state.message != null) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(state.message!),
                      backgroundColor: const Color(0xFF10B981),
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                } else if (state is ActivityError) {
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
                if (state is ActivityLoading) {
                  return const Center(child: CircularProgressIndicator(color: Color(0xFFE11D48)));
                }

                if (state is ActivityLoaded) {
                  final list = state.activities.where((a) {
                    if (_selectedFilter == 'todas') return true;
                    return a.planType == _selectedFilter;
                  }).toList();

                  if (list.isEmpty) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.event_busy, size: 54, color: Colors.white24),
                          const SizedBox(height: 12),
                          const Text(
                            'No hay experiencias registradas',
                            style: TextStyle(color: Colors.white70, fontSize: 16),
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            'Toca "+ Nueva Cita" para estructurar tu próximo plan maestro con Dei.',
                            style: TextStyle(color: Colors.white38, fontSize: 13),
                          ),
                        ],
                      ),
                    );
                  }

                  return ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    itemCount: list.length,
                    itemBuilder: (context, index) {
                      final act = list[index];
                      final badgeColor = _getBadgeColor(act.planType);
                      final badgeLabel = _getBadgeLabel(act.planType);
                      final plan = act.datePlan;

                      return Card(
                        color: const Color(0xFF1E293B),
                        margin: const EdgeInsets.only(bottom: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(color: badgeColor.withOpacity(0.2)),
                        ),
                        child: InkWell(
                          borderRadius: BorderRadius.circular(16),
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => PlanDetailPage(activity: act),
                              ),
                            );
                          },
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: badgeColor.withOpacity(0.2),
                                        borderRadius: BorderRadius.circular(12),
                                        border: Border.all(color: badgeColor.withOpacity(0.4)),
                                      ),
                                      child: Text(
                                        badgeLabel,
                                        style: TextStyle(
                                          color: badgeColor,
                                          fontSize: 11,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                    Text(
                                      '${act.startDate.day}/${act.startDate.month}/${act.startDate.year}',
                                      style: const TextStyle(color: Colors.white38, fontSize: 12),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 10),
                                Text(
                                  act.title,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 17,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                if (act.description.isNotEmpty) ...[
                                  const SizedBox(height: 6),
                                  Text(
                                    act.description,
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(color: Colors.white70, fontSize: 13),
                                  ),
                                ],
                                const SizedBox(height: 12),
                                const Divider(color: Colors.white12, height: 1),
                                const SizedBox(height: 10),
                                Row(
                                  children: [
                                    if (plan != null && plan.motivo.isNotEmpty) ...[
                                      const Icon(Icons.lightbulb_outline, size: 14, color: Colors.amber),
                                      const SizedBox(width: 4),
                                      Expanded(
                                        child: Text(
                                          'Motivo: ${plan.motivo}',
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: const TextStyle(color: Colors.white54, fontSize: 11),
                                        ),
                                      ),
                                    ],
                                    if (plan != null && plan.preMitigacionRiesgos.isNotEmpty)
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: Colors.white.withOpacity(0.06),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Text(
                                          'Checklist: ${plan.preMitigacionRiesgos.length} tareas',
                                          style: const TextStyle(color: Colors.white60, fontSize: 10),
                                        ),
                                      ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  );
                }

                return const SizedBox();
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String key, String label) {
    final isSelected = _selectedFilter == key;
    return ChoiceChip(
      label: Text(
        label,
        style: TextStyle(
          color: isSelected ? Colors.white : Colors.white70,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          fontSize: 12,
        ),
      ),
      selected: isSelected,
      selectedColor: const Color(0xFFE11D48),
      backgroundColor: const Color(0xFF0F172A),
      onSelected: (_) => setState(() => _selectedFilter = key),
    );
  }
}
