import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePeriodosNominaDto } from './dto/create-periodos_nomina.dto';

@Injectable()
export class PeriodosNominaService {
  constructor(
  private readonly prisma: PrismaService,
) { }

  async create(data: CreatePeriodosNominaDto) {

  try {

    const fechaInicio =
      new Date(data.fecha_inicio);

    const fechaFin =
      new Date(data.fecha_fin);

    if (fechaFin <= fechaInicio) {

      throw new BadRequestException(
        'La fecha fin debe ser mayor a la fecha inicio'
      );

    }

    const existe =
      await this.prisma.periodos_nomina.findFirst({
        where: {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
        },
      });

    if (existe) {

      throw new BadRequestException(
        'El período ya existe'
      );

    }

    const estadoNormalizado =
      data.estado?.trim().toUpperCase()
      || 'ABIERTO';

    const periodoCreado =
  await this.prisma.periodos_nomina.create({
    data: {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      estado: estadoNormalizado,
    },
  });

const empleados =
  await this.prisma.empleados.findMany({
    where: {
      estado: 'ACTIVO',
    },
  });

for (const empleado of empleados) {

  const salarioBase =
    Number(empleado.salario_base);

  const igss =
    salarioBase * 0.0483;

  const salarioNeto =
    salarioBase - igss;

  await this.prisma.detalles_nomina.create({
    data: {

      periodo_nomina_id:
        periodoCreado.id,

      empleado_id:
        empleado.id,

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

}

return periodoCreado;

  } catch (error: any) {

    throw new BadRequestException(
      error.message || 'Error al crear período'
    );

  }

  
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

  async cerrarPeriodo(id: number) {

  const periodo =
    await this.prisma.periodos_nomina.findUnique({
      where: { id },
    });

  if (!periodo) {
    throw new NotFoundException(
      `Periodo con ID ${id} no encontrado`
    );
  }

  return await this.prisma.periodos_nomina.update({
    where: { id },
    data: {
      estado: 'CERRADO',
    },
  });

}
}

