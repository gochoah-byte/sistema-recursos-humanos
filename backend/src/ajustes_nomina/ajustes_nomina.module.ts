import { Module } from '@nestjs/common';
import { AjustesNominaService } from './ajustes_nomina.service';
import { AjustesNominaController } from './ajustes_nomina.controller';

@Module({
  controllers: [AjustesNominaController],
  providers: [AjustesNominaService],
})
export class AjustesNominaModule {}
