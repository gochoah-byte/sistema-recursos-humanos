import { Module } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { EmpleadosController } from './empleados.controller';
import { PrismaService } from '../prisma.service';
import { AuditoriaModule } from '../auditoria/auditoria.module'; 

@Module({
  imports: [AuditoriaModule], 
  controllers: [EmpleadosController],
  providers: [EmpleadosService, PrismaService ],
})
export class EmpleadosModule { }
