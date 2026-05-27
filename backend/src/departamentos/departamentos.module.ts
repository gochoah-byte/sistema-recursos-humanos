import { Module } from '@nestjs/common';
import { DepartamentoService } from './departamentos.service';
import { DepartamentoController } from './departamentos.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DepartamentoController],

  providers: [
    DepartamentoService,
    PrismaService
  ],
})
export class DepartamentoModule { }