import { Module } from '@nestjs/common';
import { AjustesNominaService } from './ajustes_nomina.service';
import { AjustesNominaController } from './ajustes_nomina.controller';
import { PrismaService } from '../prisma.service';
import { AuditoriaModule } from '../auditoria/auditoria.module'; 

@Module({
  imports: [AuditoriaModule], 
  controllers: [AjustesNominaController],
  providers: [AjustesNominaService, PrismaService],
})
export class AjustesNominaModule { }