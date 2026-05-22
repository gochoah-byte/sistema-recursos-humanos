import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDetalleNominaDto } from './dto/create-detalle_nomina.dto';
import { UpdateDetalleNominaDto } from './dto/update-detalle_nomina.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DetalleNominaService {
  constructor(private prisma: PrismaService) {}

 async create(data: CreateDetalleNominaDto) {
  const salarioBase = data.salario_base ?? 0;
  const bonificaciones = data.bonificaciones ?? 0;
  const deducciones = data.deducciones ?? 0;

  const salarioNeto = salarioBase + bonificaciones - deducciones;

  return await this.prisma.detalles_nomina.create({
    data: {
      empleado_id: data.empleado_id,
      periodo_nomina_id: data.periodo_id,

      salario_base_snapshot: new Prisma.Decimal(salarioBase),
      bonificaciones: new Prisma.Decimal(bonificaciones),
      deducciones_total: new Prisma.Decimal(deducciones),
      salario_neto: new Prisma.Decimal(salarioNeto),
    },
  });
}

  async findAll() {
    return await this.prisma.detalles_nomina.findMany({
      include: {
        empleados: true,
        periodos_nomina: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.detalles_nomina.findUnique({
      where: { id },
      include: {
        empleados: true,
        periodos_nomina: true,
      },
    });
  }

 async update(id: number, data: UpdateDetalleNominaDto) {
  const actual = await this.prisma.detalles_nomina.findUnique({
    where: { id },
  });

  if (!actual) {
    throw new Error('Registro no encontrado');
  }

  const salarioBase = data.salario_base ?? Number(actual.salario_base_snapshot);
  const bonificaciones = data.bonificaciones ?? Number(actual.bonificaciones ?? 0);
  const deducciones = data.deducciones ?? Number(actual.deducciones_total ?? 0);

  return await this.prisma.detalles_nomina.update({
    where: { id },
    data: {
      empleado_id: data.empleado_id ?? actual.empleado_id,
      periodo_nomina_id: data.periodo_id ?? actual.periodo_nomina_id,

      salario_base_snapshot: new Prisma.Decimal(salarioBase),
      bonificaciones: new Prisma.Decimal(bonificaciones),
      deducciones_total: new Prisma.Decimal(deducciones),

      salario_neto: new Prisma.Decimal(
        salarioBase + bonificaciones - deducciones
      ),
    },
  });
}


  async remove(id: number) {
    return await this.prisma.detalles_nomina.delete({
      where: { id },
    });
  }
}