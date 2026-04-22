import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('RRHH Nómina API - UMG') 
    .setDescription('Documentación de la API para el sistema de Recursos Humanos')
    .setVersion('1.0')
    .addTag('empleados') 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  app.enableCors();

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Servidor corriendo en: http://localhost:3000/api`);
}
bootstrap();