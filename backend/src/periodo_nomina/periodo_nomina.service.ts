import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePeriodoNominaDto } from './dto/create-periodo_nomina.dto';
import { UpdatePeriodoNominaDto } from './dto/update-periodo_nomina.dto';

@Injectable()
export class PeriodoNominaService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePeriodoNominaDto) {
    return await this.prisma.periodos_nomina.create({
      data: {
        fecha_inicio: new Date(data.fecha_inicio),
        fecha_fin: new Date(data.fecha_fin),
        estado: data.estado,
      },
    });
  }

  async findAll() {
    return await this.prisma.periodos_nomina.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.periodos_nomina.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdatePeriodoNominaDto) {
    return await this.prisma.periodos_nomina.update({
      where: { id },
      data: {
        ...data,
        fecha_inicio: data.fecha_inicio
          ? new Date(data.fecha_inicio)
          : undefined,
        fecha_fin: data.fecha_fin
          ? new Date(data.fecha_fin)
          : undefined,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.periodos_nomina.delete({
      where: { id },
    });
  }
}