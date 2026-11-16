import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:package_info_plus/package_info_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import '../network/api_client.dart';

class OtaUpdateInfo {
  final String app;
  final String version;
  final int versionCode;
  final bool mandatory;
  final String changelog;
  final String downloadUrl;

  OtaUpdateInfo({
    required this.app,
    required this.version,
    required this.versionCode,
    required this.mandatory,
    required this.changelog,
    required this.downloadUrl,
  });

  factory OtaUpdateInfo.fromJson(Map<String, dynamic> json) {
    return OtaUpdateInfo(
      app: json['app'] ?? 'Lovesa Mobile',
      version: json['version'] ?? '1.0.0+1',
      versionCode: json['versionCode'] ?? 1,
      mandatory: json['mandatory'] ?? false,
      changelog: json['changelog'] ?? '',
      downloadUrl: json['downloadUrl'] ?? '',
    );
  }
}

class OtaUpdaterService {
  final http.Client client;

  OtaUpdaterService({required this.client});

  Future<OtaUpdateInfo?> checkForUpdate() async {
    try {
      final res = await client.get(Uri.parse(ApiClient.otaVersionUrl));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final remoteInfo = OtaUpdateInfo.fromJson(data);

        final packageInfo = await PackageInfo.fromPlatform();
        final currentCode = int.tryParse(packageInfo.buildNumber) ?? 1;

        if (remoteInfo.versionCode > currentCode) {
          return remoteInfo;
        }
      }
    } catch (e) {
      // Si falla la red o no hay conexión, continúa sin bloquear la app
    }
    return null;
  }

  Future<bool> launchDownload(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      return await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
    return false;
  }
}
