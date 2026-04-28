import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePeriodosNominaDto } from './dto/create-periodos_nomina.dto';

@Injectable()
export class PeriodosNominaService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreatePeriodosNominaDto) {
    return await this.prisma.periodos_nomina.create({
      data: {
        fecha_inicio: new Date(data.fecha_inicio),
        fecha_fin: new Date(data.fecha_fin),
        estado: data.estado || 'ABIERTO',
      },
    });
  }

  async findAll() {
    return await this.prisma.periodos_nomina.findMany({
      orderBy: { fecha_inicio: 'desc' },
    });
  }

  async findOne(id: number) {
    const periodo = await this.prisma.periodos_nomina.findUnique({
      where: { id },
    });
    if (!periodo) throw new NotFoundException(`Periodo con ID ${id} no encontrado`);
    return periodo;
  }
}
