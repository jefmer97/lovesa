import '../../domain/entities/activity_plan.dart';

class DatePlanModel extends DatePlanEntity {
  const DatePlanModel({
    super.motivo,
    super.imagenMia,
    super.halagosTension1,
    super.objeto,
    super.regla,
    super.lugarSecundario,
    super.halagosTension2,
    super.cierre,
    super.preMitigacionRiesgos,
    super.preTransporte,
    super.postFeedback,
    super.postMemorias,
    super.rating,
  });

  factory DatePlanModel.fromJson(Map<String, dynamic> json) {
    final pre = json['pre'] as Map<String, dynamic>? ?? {};
    final post = json['post'] as Map<String, dynamic>? ?? {};

    List<String> parseStringList(dynamic list) {
      if (list is List) {
        return list.map((e) => e.toString()).toList();
      }
      return [];
    }

    return DatePlanModel(
      motivo: json['motivo'] ?? '',
      imagenMia: json['imagenMia'] ?? '',
      halagosTension1: json['halagosTension1'] ?? '',
      objeto: json['objeto'] ?? '',
      regla: json['regla'] ?? '',
      lugarSecundario: json['lugarSecundario'] ?? '',
      halagosTension2: json['halagosTension2'] ?? '',
      cierre: json['cierre'] ?? '',
      preMitigacionRiesgos: parseStringList(pre['mitigacionRiesgosChecklist']),
      preTransporte: pre['transporteRuta'] ?? '',
      postFeedback: post['feedback'] ?? '',
      postMemorias: post['momentosMemorables'] ?? '',
      rating: post['calificacion'] is int ? post['calificacion'] : 5,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'motivo': motivo,
      'imagenMia': imagenMia,
      'halagosTension1': halagosTension1,
      'objeto': objeto,
      'regla': regla,
      'lugarSecundario': lugarSecundario,
      'halagosTension2': halagosTension2,
      'cierre': cierre,
      'pre': {
        'mitigacionRiesgosChecklist': preMitigacionRiesgos,
        'transporteRuta': preTransporte,
      },
      'post': {
        'feedback': postFeedback,
        'momentosMemorables': postMemorias,
        'calificacion': rating,
      },
    };
  }
}

class ActivityModel extends ActivityEntity {
  const ActivityModel({
    required super.id,
    required super.title,
    super.description,
    required super.startDate,
    required super.endDate,
    super.isAllDay,
    super.notes,
    super.media,
    super.planType,
    super.datePlan,
  });

  factory ActivityModel.fromJson(Map<String, dynamic> json) {
    DatePlanModel? plan;
    if (json['datePlan'] is Map<String, dynamic>) {
      plan = DatePlanModel.fromJson(json['datePlan'] as Map<String, dynamic>);
    }

    return ActivityModel(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      startDate: json['startDate'] != null
          ? DateTime.tryParse(json['startDate'].toString()) ?? DateTime.now()
          : DateTime.now(),
      endDate: json['endDate'] != null
          ? DateTime.tryParse(json['endDate'].toString()) ?? DateTime.now()
          : DateTime.now(),
      isAllDay: json['isAllDay'] ?? false,
      notes: json['notes'] ?? '',
      media: json['media'] is List
          ? (json['media'] as List).map((e) => e.toString()).toList()
          : [],
      planType: json['planType'] ?? 'fuerte',
      datePlan: plan,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'description': description,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'isAllDay': isAllDay,
      'notes': notes,
      'media': media,
      'planType': planType,
      if (datePlan != null)
        'datePlan': (datePlan is DatePlanModel)
            ? (datePlan as DatePlanModel).toJson()
            : DatePlanModel(
                motivo: datePlan!.motivo,
                imagenMia: datePlan!.imagenMia,
                halagosTension1: datePlan!.halagosTension1,
                objeto: datePlan!.objeto,
                regla: datePlan!.regla,
                lugarSecundario: datePlan!.lugarSecundario,
                halagosTension2: datePlan!.halagosTension2,
                cierre: datePlan!.cierre,
                preMitigacionRiesgos: datePlan!.preMitigacionRiesgos,
                preTransporte: datePlan!.preTransporte,
                postFeedback: datePlan!.postFeedback,
                postMemorias: datePlan!.postMemorias,
                rating: datePlan!.rating,
              ).toJson(),
    };
  }
}
