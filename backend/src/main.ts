import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  // Debug: verificar variables de entorno
  console.log('Environment variables check:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET');
  console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET');
  
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());
  const port = 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend listening on http://localhost:${port}`);
}
bootstrap();
