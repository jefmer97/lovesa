import 'package:get_it/get_it.dart';
import 'package:http/http.dart' as http;

import 'core/network/api_client.dart';
import 'core/updater/ota_updater_service.dart';

// Reminders & Push
import 'features/reminders_push/data/datasources/reminder_remote_datasource.dart';
import 'features/reminders_push/data/repositories/reminder_repository_impl.dart';
import 'features/reminders_push/domain/repositories/reminder_repository.dart';
import 'features/reminders_push/domain/usecases/get_reminders.dart';
import 'features/reminders_push/domain/usecases/create_reminder.dart';
import 'features/reminders_push/domain/usecases/toggle_reminder.dart';
import 'features/reminders_push/domain/usecases/send_test_push.dart';
import 'features/reminders_push/presentation/bloc/reminder_bloc.dart';

// Experiences & Planning (14 Pillars)
import 'features/experiences/data/datasources/activity_remote_datasource.dart';
import 'features/experiences/data/repositories/activity_repository_impl.dart';
import 'features/experiences/domain/repositories/activity_repository.dart';
import 'features/experiences/domain/usecases/get_activities.dart';
import 'features/experiences/domain/usecases/save_activity.dart';
import 'features/experiences/presentation/bloc/activity_bloc.dart';

// AI Director (Gemini 3.8 Flash)
import 'features/ai_director/data/datasources/ai_remote_datasource.dart';
import 'features/ai_director/data/repositories/ai_repository_impl.dart';
import 'features/ai_director/domain/repositories/ai_repository.dart';
import 'features/ai_director/domain/usecases/get_ai_history.dart';
import 'features/ai_director/domain/usecases/send_ai_message.dart';
import 'features/ai_director/presentation/bloc/ai_bloc.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // ----------------------------------------------------
  // Core & External
  // ----------------------------------------------------
  final httpClient = http.Client();
  sl.registerLazySingleton<http.Client>(() => httpClient);

  sl.registerLazySingleton<ApiClient>(() => ApiClient(client: sl()));
  sl.registerLazySingleton<OtaUpdaterService>(() => OtaUpdaterService(client: sl()));

  // ----------------------------------------------------
  // Feature: Reminders & Push Notifications
  // ----------------------------------------------------
  // Bloc
  sl.registerFactory(() => ReminderBloc(
        getReminders: sl(),
        createReminder: sl(),
        toggleReminder: sl(),
        sendTestPush: sl(),
      ));

  // UseCases
  sl.registerLazySingleton(() => GetReminders(sl()));
  sl.registerLazySingleton(() => CreateReminder(sl()));
  sl.registerLazySingleton(() => ToggleReminder(sl()));
  sl.registerLazySingleton(() => SendTestPush(sl()));

  // Repository
  sl.registerLazySingleton<ReminderRepository>(
    () => ReminderRepositoryImpl(remoteDataSource: sl()),
  );

  // DataSource
  sl.registerLazySingleton<ReminderRemoteDataSource>(
    () => ReminderRemoteDataSourceImpl(apiClient: sl()),
  );

  // ----------------------------------------------------
  // Feature: Experiences & 14 Pillars Planning
  // ----------------------------------------------------
  // Bloc
  sl.registerFactory(() => ActivityBloc(
        getActivities: sl(),
        saveActivity: sl(),
        repository: sl(),
      ));

  // UseCases
  sl.registerLazySingleton(() => GetActivities(sl()));
  sl.registerLazySingleton(() => SaveActivity(sl()));

  // Repository
  sl.registerLazySingleton<ActivityRepository>(
    () => ActivityRepositoryImpl(remoteDataSource: sl()),
  );

  // DataSource
  sl.registerLazySingleton<ActivityRemoteDataSource>(
    () => ActivityRemoteDataSourceImpl(apiClient: sl()),
  );

  // ----------------------------------------------------
  // Feature: AI Director (Gemini 3.8 Flash)
  // ----------------------------------------------------
  // Bloc
  sl.registerFactory(() => AiBloc(
        getAiHistory: sl(),
        sendAiMessage: sl(),
        repository: sl(),
      ));

  // UseCases
  sl.registerLazySingleton(() => GetAiHistory(sl()));
  sl.registerLazySingleton(() => SendAiMessage(sl()));

  // Repository
  sl.registerLazySingleton<AiRepository>(
    () => AiRepositoryImpl(remoteDataSource: sl()),
  );

  // DataSource
  sl.registerLazySingleton<AiRemoteDataSource>(
    () => AiRemoteDataSourceImpl(apiClient: sl()),
  );
}
