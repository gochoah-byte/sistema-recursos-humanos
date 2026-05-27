import { Module } from '@nestjs/common';
import { PuestoService } from './puestos.service';
import { PuestoController } from './puestos.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PuestoController],

  providers: [
    PuestoService,
    PrismaService
  ],
})
export class PuestosModule { }
