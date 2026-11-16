import 'package:flutter/material.dart';

class AnniversaryBannerCard extends StatelessWidget {
  final VoidCallback onPlanDate;
  final VoidCallback onTestPush;

  const AnniversaryBannerCard({
    super.key,
    required this.onPlanDate,
    required this.onTestPush,
  });

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final anniversaryStart = DateTime(2026, 8, 15);

    // Calculate months together
    int months = (now.year - anniversaryStart.year) * 12 + (now.month - anniversaryStart.month);
    if (now.day < 15 && months > 0) months--;
    if (months < 1) months = 1;

    // Days until next 15th
    DateTime next15th = DateTime(now.year, now.month, 15);
    if (now.day > 15) {
      next15th = DateTime(now.year, now.month + 1, 15);
    }
    final daysLeft = next15th.difference(DateTime(now.year, now.month, now.day)).inDays;
    final isToday = now.day == 15;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFE11D48), Color(0xFF9333EA)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFE11D48).withOpacity(0.35),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.favorite, color: Colors.white, size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Aniversario Mensual (Día 15)',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.5,
                      ),
                    ),
                    Text(
                      isToday
                          ? '¡HOY ES NUESTRO DÍA! 🎉'
                          : (daysLeft == 1 ? '¡Mañana es el Aniversario!' : 'Faltan $daysLeft días para el 15'),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.25),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'Mes $months ❤️',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Text(
            'Recuerda: Tu Director AI te envía una alerta preventiva el día 13 (8:00 AM) para las flores/detalles y la notificación oficial el día 15.',
            style: TextStyle(color: Colors.white, fontSize: 12, height: 1.4),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: onPlanDate,
                  icon: const Icon(Icons.event_note, size: 16),
                  label: const Text('Planear Cita'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFFE11D48),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 10),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              OutlinedButton.icon(
                onPressed: onTestPush,
                icon: const Icon(Icons.notifications_active, size: 16, color: Colors.white),
                label: const Text('Probar Push', style: TextStyle(color: Colors.white)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.white54),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
