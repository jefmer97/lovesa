import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  final String message;
  const Failure(this.message);

  @override
  List<Object?> get props => [message];
}

class ServerFailure extends Failure {
  const ServerFailure([String message = 'Error en el servidor de Lovesa']) : super(message);
}

class CacheFailure extends Failure {
  const CacheFailure([String message = 'Error al leer almacenamiento local']) : super(message);
}

class NetworkFailure extends Failure {
  const NetworkFailure([String message = 'Sin conexión a internet']) : super(message);
}

class ServerException implements Exception {
  final String message;
  ServerException([this.message = 'Error del servidor']);
}

class CacheException implements Exception {
  final String message;
  CacheException([this.message = 'Error de caché local']);
}
