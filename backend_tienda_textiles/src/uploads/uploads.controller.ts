// uploads.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('uploads') // ← Sin '/' al inicio
export class UploadsController {
  @Post() // ← Sin ruta adicional, responde a POST /api/v1/uploads
  @UseInterceptors(
    FileInterceptor('file', {
      // ← DEBE coincidir con fd.append('file', file)
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          console.log('Archivo rechazado, no es imagen');
          return cb(null, false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    console.log('Archivo recibido en backend:', file);

    if (!file) {
      console.log('No se recibió ningún archivo');
      return { url: null };
    }

    const base = process.env.API_BASE_URL || 'http://localhost:3000';
    const url = `${base}/uploads/${file.filename}`;
    console.log('URL generada:', url);

    return { url };
  }
}
