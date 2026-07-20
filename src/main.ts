import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { execSync } from 'child_process';

async function bootstrap() {
  const logger = new Logger('Sayerli');

  try {
    logger.log('Running database migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    logger.log('Migrations complete.');
  } catch (e) {
    logger.error(`Migration warning (non-fatal): ${(e as Error).message}`);
  }
  const app = await NestFactory.create(AppModule);

  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  const allowedOrigin = process.env.FRONTEND_URL;
  if (!allowedOrigin) {
    throw new Error('FRONTEND_URL env variable is required');
  }
  app.enableCors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Sayerli Backend démarré sur: http://localhost:${port}/api/v1`);
  logger.log(`📋 Environnement: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();
