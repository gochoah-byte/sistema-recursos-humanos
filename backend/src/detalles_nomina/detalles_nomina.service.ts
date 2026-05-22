import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDetallesNominaDto } from './dto/create-detalles_nomina.dto';

@Injectable()
export class DetallesNominaService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateDetallesNominaDto) {
    try {
    const empleado = await this.prisma.empleados.findUnique({
      where: { id: data.empleado_id },
    });

    if (!empleado) {
      throw new NotFoundException('El empleado no existe');
    }
    const periodo = await this.prisma.periodos_nomina.findUnique({
  where: {
    id: data.periodo_nomina_id
  },
});

if (!periodo) {
  throw new NotFoundException(
    'El período de nómina no existe'
  );
}

    const salarioBase = Number(empleado.salario_base);

 const igss = salarioBase * 0.0483;

const deducciones = igss;

const salarioNeto = salarioBase - deducciones;

    return await this.prisma.detalles_nomina.create({
      data: {
        periodo_nomina_id: data.periodo_nomina_id,
        empleado_id: data.empleado_id,
        salario_base_snapshot: salarioBase,
        horas_extra: 0,
        monto_horas_extra: 0,
        bonificaciones: 0,
        deducciones_total: deducciones,
salario_neto: salarioNeto,
      },
    });
    } catch (error) {

console.log(error);

throw error;

}
  }

  async findAll() {
    try {
    return await this.prisma.detalles_nomina.findMany({
      include: {
        empleados: true,
        periodos_nomina: true,
        ajustes_nomina: true, 
      },
    });
    } catch (error) {

console.log(error);

throw error;

}
  }
}