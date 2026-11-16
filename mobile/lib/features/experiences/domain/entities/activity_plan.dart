import 'package:equatable/equatable.dart';

class DatePlanEntity extends Equatable {
  final String motivo;
  final String imagenMia;
  final String halagosTension1;
  final String objeto;
  final String regla;
  final String lugarSecundario;
  final String halagosTension2;
  final String cierre;
  final List<String> preMitigacionRiesgos;
  final String preTransporte;
  final String postFeedback;
  final String postMemorias;
  final int rating;

  const DatePlanEntity({
    this.motivo = '',
    this.imagenMia = '',
    this.halagosTension1 = '',
    this.objeto = '',
    this.regla = '',
    this.lugarSecundario = '',
    this.halagosTension2 = '',
    this.cierre = '',
    this.preMitigacionRiesgos = const [],
    this.preTransporte = '',
    this.postFeedback = '',
    this.postMemorias = '',
    this.rating = 5,
  });

  DatePlanEntity copyWith({
    String? motivo,
    String? imagenMia,
    String? halagosTension1,
    String? objeto,
    String? regla,
    String? lugarSecundario,
    String? halagosTension2,
    String? cierre,
    List<String>? preMitigacionRiesgos,
    String? preTransporte,
    String? postFeedback,
    String? postMemorias,
    int? rating,
  }) {
    return DatePlanEntity(
      motivo: motivo ?? this.motivo,
      imagenMia: imagenMia ?? this.imagenMia,
      halagosTension1: halagosTension1 ?? this.halagosTension1,
      objeto: objeto ?? this.objeto,
      regla: regla ?? this.regla,
      lugarSecundario: lugarSecundario ?? this.lugarSecundario,
      halagosTension2: halagosTension2 ?? this.halagosTension2,
      cierre: cierre ?? this.cierre,
      preMitigacionRiesgos: preMitigacionRiesgos ?? this.preMitigacionRiesgos,
      preTransporte: preTransporte ?? this.preTransporte,
      postFeedback: postFeedback ?? this.postFeedback,
      postMemorias: postMemorias ?? this.postMemorias,
      rating: rating ?? this.rating,
    );
  }

  @override
  List<Object?> get props => [
        motivo,
        imagenMia,
        halagosTension1,
        objeto,
        regla,
        lugarSecundario,
        halagosTension2,
        cierre,
        preMitigacionRiesgos,
        preTransporte,
        postFeedback,
        postMemorias,
        rating,
      ];
}

class ActivityEntity extends Equatable {
  final String id;
  final String title;
  final String description;
  final DateTime startDate;
  final DateTime endDate;
  final bool isAllDay;
  final String notes;
  final List<String> media;
  final String planType; // 'fuerte', 'suave', 'hito', 'recuerdo'
  final DatePlanEntity? datePlan;

  const ActivityEntity({
    required this.id,
    required this.title,
    this.description = '',
    required this.startDate,
    required this.endDate,
    this.isAllDay = false,
    this.notes = '',
    this.media = const [],
    this.planType = 'fuerte',
    this.datePlan,
  });

  ActivityEntity copyWith({
    String? id,
    String? title,
    String? description,
    DateTime? startDate,
    DateTime? endDate,
    bool? isAllDay,
    String? notes,
    List<String>? media,
    String? planType,
    DatePlanEntity? datePlan,
  }) {
    return ActivityEntity(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      isAllDay: isAllDay ?? this.isAllDay,
      notes: notes ?? this.notes,
      media: media ?? this.media,
      planType: planType ?? this.planType,
      datePlan: datePlan ?? this.datePlan,
    );
  }

  @override
  List<Object?> get props => [
        id,
        title,
        description,
        startDate,
        endDate,
        isAllDay,
        notes,
        media,
        planType,
        datePlan,
      ];
}
