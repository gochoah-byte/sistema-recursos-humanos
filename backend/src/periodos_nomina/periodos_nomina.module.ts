import { Module } from '@nestjs/common';
import { PeriodosNominaService } from './periodos_nomina.service';
import { PeriodosNominaController } from './periodos_nomina.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PeriodosNominaController],
  providers: [PeriodosNominaService, PrismaService],
})
export class PeriodosNominaModule { }