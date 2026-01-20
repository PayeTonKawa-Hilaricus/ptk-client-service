import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ajout recommandé pour sécuriser les entrées
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // --- CONFIGURATION SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('Client Service API')
    .setDescription('Gestion des clients (CRM)')
    .setVersion('1.0')
    .addTag('customers')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // -----------------------------

  await app.listen(3000);
}
void bootstrap();
