import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Injectable()
export class EmpleadosService {
  constructor(private prisma: PrismaService, private auditoriaService: AuditoriaService) { }

  async create(createEmpleadoDto: CreateEmpleadoDto) {
    try{
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
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('El DPI ya está registrado en el sistema');
      }
      throw error;
    }
    
  }

  async findAll(estado?: string) {
    const whereClause = estado && estado !== 'TODOS' ? { estado } : {};
    const lista = await this.prisma.empleados.findMany({
      where: whereClause,
      orderBy: {
        salario_base: 'desc' 
      }
    });
    if (lista.length === 0) {
      return {
        message: `No se encontraron empleados registrados ${estado ? 'con estado ' + estado : ''}`,
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
  throw new NotFoundException(
    `Empleado con ID ${id} no encontrado`
  );
}

  return empleado;
}

 
  async update(id: number, updateEmpleadoDto: UpdateEmpleadoDto) {
    const empleado = await this.prisma.empleados.findUnique({ where: { id } });
    if (!empleado) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }

    if (updateEmpleadoDto.nombres === "" || updateEmpleadoDto.dpi === "") {
      throw new BadRequestException('El nombre y el DPI son campos obligatorios');
    }

    const data = {
  ...updateEmpleadoDto,
  fecha_nacimiento: updateEmpleadoDto.fecha_nacimiento
    ? new Date(updateEmpleadoDto.fecha_nacimiento)
    : undefined,
};

return this.prisma.empleados.update({
  where: { id },
  data,
});
  }

  async remove(id: number) {
    const empleado = await this.prisma.empleados.findUnique({
      where: { id },
    });

    if (!empleado) {
      throw new NotFoundException(`No se puede procesar: El empleado con ID ${id} no existe.`);
    }

    const empleadoInactivo = await this.prisma.empleados.update({
      where: { id },
      data: {
        estado: 'SUSPENDIDO'
      },
    });

    await this.auditoriaService.create({
      usuario_id: 5, // Aquí deberías pasar el ID del usuario que está logueado
      accion: 'SOFT_DELETE_EMPLEADO',
      entidad: 'empleados',
      entidad_id: id,
      descripcion: `Se cambió el estado del empleado ${empleado.nombres} ${empleado.apellidos} a SUSPENDIDO.`,
    });

    return {
      message: 'Empleado suspendido correctamente (Soft Delete)',
      data: empleadoInactivo
    };
  }

  async findIncompletos() {

    const incompletos = await this.prisma.empleados.findMany({
      where: {
        documentos: {
          none: {} 
        }
      },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        dpi: true,
        estado: true
      }
    });

    return {
      total: incompletos.length,
      descripcion: "Empleados que no han entregado ningún documento para su expediente digital",
      empleados: incompletos
    };
  }

}