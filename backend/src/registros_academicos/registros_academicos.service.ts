import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRegistrosAcademicoDto } from './dto/create-registros_academico.dto';
import { UpdateRegistrosAcademicoDto } from './dto/update-registros_academico.dto';

@Injectable()
export class RegistrosAcademicosService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateRegistrosAcademicoDto) {
    try {
    const empleadoExiste =
  await this.prisma.empleados.findUnique({
    where: {
      id: data.empleado_id
    }
  });

if (!empleadoExiste) {
  throw new NotFoundException(
    'Empleado no encontrado'
  );
}
    const nuevo = await this.prisma.registros_academicos.create({
      data: {
        empleado_id: data.empleado_id,
        tipo: data.tipo,
        titulo: data.titulo,
        institucion: data.institucion,
        fecha_graduacion: new Date(data.fecha_graduacion),
      },
    });

    return {
      message: 'Registro académico creado',
      data: nuevo,
    };
    } catch (error) {

  console.log(error);

  throw error;

}
  }

  async findAll() {
    
    return await this.prisma.registros_academicos.findMany({
      include: {
        empleados: true, 
      },
    });
  }

  async findOne(id: number) {
      try {

    const registro = await this.prisma.registros_academicos.findUnique({
      where: { id },
    });
    

    if (!registro) {
      throw new NotFoundException('Registro académico no encontrado');
    }

  return registro;

  } catch (error) {

    console.log(error);

    throw error;

  }

}

async findByEmpleado(empleadoId: number) {

  try {

    return await this.prisma.registros_academicos.findMany({
      where: { empleado_id: empleadoId },
    });

  } catch (error) {

    console.log(error);

    throw error;

  }

}
  async update(id: number, data: UpdateRegistrosAcademicoDto) {
    const existe = await this.prisma.registros_academicos.findUnique({
      where: { id },
    });

    if (!existe) {
      throw new NotFoundException('Registro no encontrado para actualizar');
    }

    return await this.prisma.registros_academicos.update({
      where: { id },
      data: {
        tipo: data.tipo,
        titulo: data.titulo,
        institucion: data.institucion,
        fecha_graduacion: data.fecha_graduacion
          ? new Date(data.fecha_graduacion)
          : undefined,
      },
    });
  }

  async remove(id: number) {
    const existe = await this.prisma.registros_academicos.findUnique({
      where: { id },
    });

    if (!existe) {
      throw new NotFoundException('Registro no encontrado para eliminar');
    }

    await this.prisma.registros_academicos.delete({
      where: { id },
    });

    return { message: 'Registro eliminado correctamente' };
  }
  
}