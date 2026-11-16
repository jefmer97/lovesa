import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'injection_container.dart' as di;
import 'core/updater/ota_updater_service.dart';
import 'core/updater/update_dialog.dart';
import 'features/experiences/presentation/bloc/activity_bloc.dart';
import 'features/experiences/presentation/pages/experiences_page.dart';
import 'features/reminders_push/presentation/bloc/reminder_bloc.dart';
import 'features/reminders_push/presentation/pages/reminders_page.dart';
import 'features/ai_director/presentation/bloc/ai_bloc.dart';
import 'features/ai_director/presentation/pages/ai_director_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await di.init();
  runApp(const LovesaApp());
}

class LovesaApp extends StatelessWidget {
  const LovesaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<ReminderBloc>(create: (_) => di.sl<ReminderBloc>()),
        BlocProvider<ActivityBloc>(create: (_) => di.sl<ActivityBloc>()),
        BlocProvider<AiBloc>(create: (_) => di.sl<AiBloc>()),
      ],
      child: MaterialApp(
        title: 'Lovesa',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          brightness: Brightness.dark,
          primaryColor: const Color(0xFFE11D48),
          scaffoldBackgroundColor: const Color(0xFF0F172A),
          colorScheme: const ColorScheme.dark(
            primary: Color(0xFFE11D48),
            secondary: Color(0xFF9333EA),
            surface: Color(0xFF1E293B),
            background: Color(0xFF0F172A),
          ),
          cardTheme: CardTheme(
            color: const Color(0xFF1E293B),
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
          useMaterial3: true,
        ),
        home: const LovesaHomeScreen(),
      ),
    );
  }
}

class LovesaHomeScreen extends StatefulWidget {
  const LovesaHomeScreen({super.key});

  @override
  State<LovesaHomeScreen> createState() => _LovesaHomeScreenState();
}

class _LovesaHomeScreenState extends State<LovesaHomeScreen> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    // Comprobar actualizaciones OTA (Turbo Push) en segundo plano
    WidgetsBinding.instance.addPostFrameCallback((_) {
      UpdateDialog.showIfAvailable(context, di.sl<OtaUpdaterService>());
    });
  }

  void _navigateToPlan() {
    setState(() {
      _currentIndex = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    final screens = [
      const ExperiencesPage(),
      RemindersPage(onNavigateToPlanDate: _navigateToPlan),
      const AiDirectorPage(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        backgroundColor: const Color(0xFF1E293B),
        indicatorColor: const Color(0xFFE11D48).withOpacity(0.25),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.favorite_outline, color: Colors.white70),
            selectedIcon: Icon(Icons.favorite, color: Color(0xFFE11D48)),
            label: 'Citas & Pilares',
          ),
          NavigationDestination(
            icon: Icon(Icons.alarm, color: Colors.white70),
            selectedIcon: Icon(Icons.notifications_active, color: Color(0xFFE11D48)),
            label: 'Recordatorios 15',
          ),
          NavigationDestination(
            icon: Icon(Icons.auto_awesome_outlined, color: Colors.white70),
            selectedIcon: Icon(Icons.auto_awesome, color: Color(0xFFE11D48)),
            label: 'Director AI',
          ),
        ],
      ),
    );
  }
}
