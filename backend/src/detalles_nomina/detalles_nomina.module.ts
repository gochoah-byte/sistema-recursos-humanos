import { Module } from '@nestjs/common';
import { DetallesNominaService } from './detalles_nomina.service';
import { DetallesNominaController } from './detalles_nomina.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DetallesNominaController],
  providers: [DetallesNominaService, PrismaService],
})
export class DetallesNominaModule { }