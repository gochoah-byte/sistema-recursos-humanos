import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';

@Injectable()
export class AuditoriaService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateAuditoriaDto) {
    try {

      const usuarioExiste =
        await this.prisma.usuarios.findUnique({
          where: {
            id: dto.usuario_id
          }
        });

      if (!usuarioExiste) {
        throw new NotFoundException(
          'Usuario no encontrado'
        );
      }

      return await this.prisma.auditoria_logs.create({
        data: {
          usuario_id: dto.usuario_id,
          accion: dto.accion,
          entidad: dto.entidad,
          entidad_id: dto.entidad_id,
          descripcion: dto.descripcion,
        },
      });

    } catch (error) {

      console.log(error);

      throw error;

    }
  }

  async findAll() {
    try {

      return await this.prisma.auditoria_logs.findMany({
       include: {
  usuarios: {
    select: {
      id: true,
      correo: true,
      rol: true,
      empleado_id: true
    }
  }
},
        orderBy: {
          creado_en: 'desc'
        },
      });

    } catch (error) {

      console.log(error);

      throw error;

    }
  }

  async findOne(id: number) {
    try {

      const auditoria =
        await this.prisma.auditoria_logs.findUnique({
          where: { id },
          include: {
            usuarios: true
          }
        });

      if (!auditoria) {
        throw new NotFoundException(
          `Registro con ID ${id} no encontrado`
        );
      }

      return auditoria;

    } catch (error) {

      console.log(error);

      throw error;

    }
  }
}