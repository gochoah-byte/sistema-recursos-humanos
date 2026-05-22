import { Module } from '@nestjs/common';
import { PeriodoNominaService } from './periodo_nomina.service';
import { PeriodoNominaController } from './periodo_nomina.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PeriodoNominaController],
  providers: [PeriodoNominaService, PrismaService],
})
export class PeriodoNominaModule {}