import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';

// Ensure local uploads directory exists as fallback
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads', { recursive: true });
}

function createGcsStorage(): Storage {
  if (process.env.GCS_CREDENTIALS_JSON) {
    const credentials = JSON.parse(process.env.GCS_CREDENTIALS_JSON);
    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }
    return new Storage({
      projectId: process.env.GCS_PROJECT_ID || credentials.project_id,
      credentials,
    });
  }

  if (process.env.GCS_CLIENT_EMAIL && process.env.GCS_PRIVATE_KEY) {
    return new Storage({
      projectId: process.env.GCS_PROJECT_ID,
      credentials: {
        client_email: process.env.GCS_CLIENT_EMAIL,
        private_key: process.env.GCS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });
  }

  return new Storage();
}

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo');
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}${extname(file.originalname)}`;
    const bucketName = process.env.GCS_BUCKET_NAME;

    // Si está configurado Google Cloud Storage (Producción)
    if (bucketName) {
      try {
        const storage = createGcsStorage();
        const bucket = storage.bucket(bucketName);
        const objectPath = `uploads/${filename}`;
        const blob = bucket.file(objectPath);

        await blob.save(file.buffer, {
          contentType: file.mimetype,
          resumable: false,
        });

        // Si el bucket usa control de acceso fino (ACL), lo hace público;
        // si usa acceso uniforme a nivel de bucket, ignora el error silenciosamente.
        await blob.makePublic().catch(() => {});

        return {
          url: `https://storage.googleapis.com/${bucketName}/${objectPath}`,
        };
      } catch (error: any) {
        console.error('Error al subir archivo a Google Cloud Storage:', error);
        throw new InternalServerErrorException(
          `Error subiendo archivo a Google Cloud Storage: ${error.message}`,
        );
      }
    }

    // Fallback local si no se ha configurado GCS_BUCKET_NAME
    const localPath = join('./uploads', filename);
    fs.writeFileSync(localPath, file.buffer);

    const baseUrl =
      process.env.BACKEND_URL ||
      (process.env.RAILWAY_PUBLIC_DOMAIN
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : `http://localhost:${process.env.PORT ?? 3001}`);
    return { url: `${baseUrl}/uploads/${filename}` };
  }
}
