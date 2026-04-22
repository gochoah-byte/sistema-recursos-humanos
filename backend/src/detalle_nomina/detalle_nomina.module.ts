import { Module } from '@nestjs/common';
import { DetalleNominaService } from './detalle_nomina.service';
import { DetalleNominaController } from './detalle_nomina.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DetalleNominaController],
  providers: [DetalleNominaService, PrismaService],
})
export class DetalleNominaModule {}