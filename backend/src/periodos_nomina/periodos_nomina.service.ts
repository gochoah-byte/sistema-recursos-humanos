import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePeriodosNominaDto } from './dto/create-periodos_nomina.dto';

@Injectable()
export class PeriodosNominaService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreatePeriodosNominaDto) {
    try {

      const fechaInicio = new Date(data.fecha_inicio);
      const fechaFin = new Date(data.fecha_fin);

      if (fechaFin < fechaInicio) {
        throw new NotFoundException(
          'La fecha fin no puede ser menor que la fecha inicio'
        );
      }

      const periodoExiste =
        await this.prisma.periodos_nomina.findFirst({
          where: {
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
          },
        });

      if (periodoExiste) {
        throw new NotFoundException(
          'Este período ya existe'
        );
      }

      return await this.prisma.periodos_nomina.create({
        data: {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          estado: data.estado || 'ABIERTO',
        },
      });

    } catch (error) {

      console.log(error);

      throw error;

    }
  }

  async findAll() {
    try {

      return await this.prisma.periodos_nomina.findMany({
        orderBy: {
          fecha_inicio: 'desc'
        },
      });

    } catch (error) {

      console.log(error);

      throw error;

    }
  }

  async findOne(id: number) {
    try {

      const periodo =
        await this.prisma.periodos_nomina.findUnique({
          where: { id },
        });

      if (!periodo) {
        throw new NotFoundException(
          `Periodo con ID ${id} no encontrado`
        );
      }

      return periodo;

    } catch (error) {

      console.log(error);

      throw error;

    }
  }
}