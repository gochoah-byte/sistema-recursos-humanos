import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDetallesNominaDto } from './dto/create-detalles_nomina.dto';

@Injectable()
export class DetallesNominaService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateDetallesNominaDto) {
    const empleado = await this.prisma.empleados.findUnique({
      where: { id: data.empleado_id },
    });

    if (!empleado) {
      throw new NotFoundException('El empleado no existe');
    }

    const salarioBase = Number(empleado.salario_base);

    return await this.prisma.detalles_nomina.create({
      data: {
        periodo_nomina_id: data.periodo_nomina_id,
        empleado_id: data.empleado_id,
        salario_base_snapshot: salarioBase,
        horas_extra: 0,
        monto_horas_extra: 0,
        bonificaciones: 0,
        deducciones_total: 0,
        salario_neto: salarioBase, 
      },
    });
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