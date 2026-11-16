# Lovesa Mobile Client 📱❤️

Cliente móvil oficial de **Lovesa** desarrollado en **Flutter** bajo los principios estrictos de **Clean Architecture** (Inspirado en el estándar de `jefmer97/clean-architecture`), integrado dentro del monorepo `lovesa/mobile`.

---

## 🏗️ Arquitectura de la Solución (Clean Architecture)

```
mobile/lib/
├── core/
│   ├── error/
│   │   └── failures.dart          # Failure, ServerFailure, CacheFailure, etc.
│   ├── network/
│   │   └── api_client.dart        # Conexión con Railway Backend (JWT, headers)
│   ├── updater/
│   │   ├── ota_updater_service.dart # Lector de version.json para auto-updates
│   │   └── update_dialog.dart     # Modal proactivo de actualización
│   └── usecases/
│       └── usecase.dart           # Contrato genérico UseCase<Type, Params>
├── features/
│   ├── reminders_push/            # Alertas Aniversario Día 15 & Notificaciones
│   │   ├── data/                  # DataSource, Model (JSON), RepositoryImpl
│   │   ├── domain/                # Entity, Repository Contract, UseCases
│   │   └── presentation/          # Bloc, RemindersPage, AnniversaryBannerCard
│   ├── experiences/               # Citas Fuertes/Suaves & Guía 14 Pilares Sheets
│   │   ├── data/                  # DataSource, ActivityModel, DatePlanModel
│   │   ├── domain/                # ActivityEntity, DatePlanEntity, UseCases
│   │   └── presentation/          # Bloc, ExperiencesPage, PlanDetailPage
│   └── ai_director/               # Copiloto Gemini 3.8 Flash
│       ├── data/                  # DataSource, ChatMessageModel, RepositoryImpl
│       ├── domain/                # ChatMessageEntity, Repository Contract, UseCases
│       └── presentation/          # Bloc, AiDirectorPage con Chips de sugerencias
├── injection_container.dart       # Service Locator con GetIt
└── main.dart                      # MaterialApp, MultiBlocProvider, Auto-Update check
```

---

## 🚀 Capacidades Principales

### 1. Auto-Actualización OTA con Turbo Push
- La aplicación compara su `buildNumber` local con el archivo remoto `version.json` desplegado en segundos mediante el script `./scripts/turbo-push.sh`.
- Notifica al usuario de forma no intrusiva con el registro de cambios (changelog) y enlace directo de actualización.

### 2. Notificaciones Push y Alertas Proactivas
- **Día 13 (8:00 AM):** Alerta preventiva automática de 48 horas para comprar flores y coordinar detalles.
- **Día 15 (8:00 AM):** Notificación de aniversario oficial celebrando los meses juntos (desde el 15 de agosto).
- **Checklist PRE:** Alerta preventiva sobre ítems no completados de mitigación de riesgos (auto tanque lleno, reservas, etc.) dentro de las 24h previas a la cita.
- **Botón de Prueba Push:** Envía una notificación instantánea al dispositivo para verificar conectividad.

### 3. Matriz de Experiencias y 14 Pilares (Google Sheets)
- Clasificación de planes:
  - 🔥 **Cita Fuerte:** Alta intensidad, aventura o escapadas (ej: Cerro Azul en el auto nuevo).
  - ☕ **Cita Suave:** Conversación relajada, café o intimidad en casa.
  - 💎 **Hito:** Celebración de aniversarios o fechas clave.
- Mapeo de los **14 Pilares**:
  1. Motivo / Storytelling
  2. Imagen Mía (Outfit, Perfume, Auto impecable)
  3. Halagos / Tensión Inicial
  4. Objeto / Detalle Sorpresa
  5. Regla del Juego / Dinámica
  6. Lugar Secundario / Cambio de Escenario
  7. Halagos / Tensión Secundaria
  8. Cierre & Recuerdo Memorable
- **PRE-DAY:** Checklist de mitigación de riesgos (auto, efectivo, ruta Waze, clima).
- **POST-DAY:** Calificación (1 a 5 estrellas), feedback de Dei y momentos memorables para el diario.

### 4. Director AI (Gemini 3.8 Flash)
- Motor configurado en `backend/src/ai/ai.service.ts` con el modelo `gemini-3.8-flash`.
- Chat en tiempo real con sugerencias rápidas para planear escapadas económicas, frases para elevar tensión y planes para los días libres.

---

## 🛠️ Cómo Compilar y Ejecutar

### Prerrequisitos
- Flutter SDK `>=3.2.0`
- Android Studio / Xcode

```bash
cd mobile
flutter pub get
flutter run
```

Para generar el APK de producción:
```bash
flutter build apk --release
```
