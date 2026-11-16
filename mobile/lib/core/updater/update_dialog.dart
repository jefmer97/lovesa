import 'package:flutter/material.dart';
import 'ota_updater_service.dart';

class UpdateDialog extends StatelessWidget {
  final OtaUpdateInfo updateInfo;
  final OtaUpdaterService updaterService;

  const UpdateDialog({
    super.key,
    required this.updateInfo,
    required this.updaterService,
  });

  static Future<void> showIfAvailable(
    BuildContext context,
    OtaUpdaterService updaterService,
  ) async {
    final update = await updaterService.checkForUpdate();
    if (update != null && context.mounted) {
      showDialog(
        context: context,
        barrierDismissible: !update.mandatory,
        builder: (_) => UpdateDialog(
          updateInfo: update,
          updaterService: updaterService,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: const Color(0xFF1E293B),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFFE11D48).withOpacity(0.2),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.system_update, color: Color(0xFFE11D48), size: 24),
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Text(
              '¡Actualización Disponible!',
              style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Versión ${updateInfo.version} (Build #${updateInfo.versionCode})',
            style: const TextStyle(color: Color(0xFFE11D48), fontWeight: FontWeight.w600, fontSize: 13),
          ),
          const SizedBox(height: 10),
          if (updateInfo.changelog.isNotEmpty) ...[
            const Text(
              'Novedades:',
              style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold, fontSize: 12),
            ),
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFF0F172A),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                updateInfo.changelog,
                style: const TextStyle(color: Colors.white70, fontSize: 12),
              ),
            ),
          ],
          const SizedBox(height: 12),
          const Text(
            'Esta versión fue desplegada automáticamente por Turbo Push con mejoras para tus citas y alertas.',
            style: TextStyle(color: Colors.white54, fontSize: 12),
          ),
        ],
      ),
      actions: [
        if (!updateInfo.mandatory)
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Más tarde', style: TextStyle(color: Colors.white54)),
          ),
        ElevatedButton(
          onPressed: () {
            updaterService.launchDownload(updateInfo.downloadUrl);
            if (!updateInfo.mandatory) {
              Navigator.pop(context);
            }
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFE11D48),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          child: const Text('Actualizar Ahora', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }
}
