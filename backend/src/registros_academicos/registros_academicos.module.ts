import { Module } from '@nestjs/common';
import { RegistrosAcademicosService } from './registros_academicos.service';
import { RegistrosAcademicosController } from './registros_academicos.controller';
import { PrismaService } from '../prisma.service'; 

@Module({
  controllers: [RegistrosAcademicosController],
  providers: [RegistrosAcademicosService, PrismaService], 
})
export class RegistrosAcademicosModule { }