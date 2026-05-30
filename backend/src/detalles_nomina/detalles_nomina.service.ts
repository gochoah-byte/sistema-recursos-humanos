import {  Injectable,  NotFoundException,  BadRequestException} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDetallesNominaDto } from './dto/create-detalles_nomina.dto';

@Injectable()
export class DetallesNominaService {
  constructor(
  private readonly prisma: PrismaService,
) { }


 async create(data: CreateDetallesNominaDto) {

  try {

    const empleado =
      await this.prisma.empleados.findUnique({
        where: {
          id: data.empleado_id,
        },
      });

    if (!empleado) {

      throw new NotFoundException(
        'El empleado no existe'
      );

    }

    const periodo =
      await this.prisma.periodos_nomina.findUnique({
        where: {
          id: data.periodo_nomina_id,
        },
      });

    if (!periodo) {

      throw new NotFoundException(
        'El período no existe'
      );

    }

    if (periodo.estado !== 'ABIERTO') {

      throw new BadRequestException(
        'El período no está abierto'
      );

    }

    const existeNomina =
      await this.prisma.detalles_nomina.findFirst({
        where: {
          empleado_id: data.empleado_id,
          periodo_nomina_id:
            data.periodo_nomina_id,
        },
      });

    if (existeNomina) {

      throw new BadRequestException(
        'La nómina ya existe para este empleado en este período'
      );

    }

    const salarioBase =
      Number(empleado.salario_base);

    const igss =
      salarioBase * 0.0483;

    const salarioNeto =
      salarioBase - igss;

    return await this.prisma.detalles_nomina.create({
      data: {

        periodo_nomina_id:
          data.periodo_nomina_id,

        empleado_id:
          data.empleado_id,

        salario_base_snapshot:
          salarioBase,

        horas_extra: 0,

        monto_horas_extra: 0,

        bonificaciones: 0,

        deducciones_total:
          Number(igss.toFixed(2)),

        salario_neto:
          Number(salarioNeto.toFixed(2)),

      },
    });

  } catch (error: any) {

    throw new BadRequestException(
      error.message || 'Error al generar nómina'
    );

  }

}

  async findAll() {
    return await this.prisma.detalles_nomina.findMany({
      include: {
        empleados: true,
        periodos_nomina: true,
        ajustes_nomina: true, 
      },
    });
  }
}