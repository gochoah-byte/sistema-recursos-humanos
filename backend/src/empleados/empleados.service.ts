import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';

@Injectable()
export class EmpleadosService {
  constructor(private prisma: PrismaService) { }

  async create(createEmpleadoDto: CreateEmpleadoDto) {
    const nuevoEmpleado = await this.prisma.empleados.create({
      data: {
        dpi: createEmpleadoDto.dpi,
        nombres: createEmpleadoDto.nombres,
        apellidos: createEmpleadoDto.apellidos,
        fecha_nacimiento: createEmpleadoDto.fecha_nacimiento ? new Date(createEmpleadoDto.fecha_nacimiento) : null,
        direccion: createEmpleadoDto.direccion,
        telefono: createEmpleadoDto.telefono,
        salario_base: createEmpleadoDto.salario_base,
        puesto: createEmpleadoDto.puesto,
        departamento: createEmpleadoDto.departamento,
        estado: createEmpleadoDto.estado,
      },
    });

    return {
      message: 'Empleado registrado correctamente',
      data: nuevoEmpleado,
    };
  }

  async findAll() {
    const lista = await this.prisma.empleados.findMany();

    if (lista.length === 0) {
      return {
        message: 'No se encontraron empleados registrados en el sistema',
        data: []
      };
    }

    return lista;
  }
  
  async findOne(id: number) {
  const empleado = await this.prisma.empleados.findUnique({
    where: { id },
  });

  if (!empleado) {
    return {
      message: 'Empleado no encontrado',
    };
  }

  return empleado;
}

async update(id: number, data: any) {
  return this.prisma.empleados.update({
    where: { id },
    data: {
      ...data,
      fecha_nacimiento: data.fecha_nacimiento
        ? new Date(data.fecha_nacimiento)
        : undefined,
    },
  });
}

async remove(id: number) {
  return this.prisma.empleados.delete({
    where: { id },
  });
}
}