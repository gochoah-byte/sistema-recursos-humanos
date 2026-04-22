import { Module } from '@nestjs/common';
import { RegistrosAcademicosService } from './registros_academicos.service';
import { RegistrosAcademicosController } from './registros_academicos.controller';
import { PrismaService } from '../prisma.service'; // 👈 IMPORTANTE

@Module({
  controllers: [RegistrosAcademicosController],
  providers: [RegistrosAcademicosService, PrismaService], // 👈 AGREGAR AQUÍ
})
export class RegistrosAcademicosModule {}