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
  
}