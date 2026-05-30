import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';

import { PrismaService } from '../prisma.service';

@Injectable()
export class DepartamentoService {
  

  constructor(
    private prisma: PrismaService
  ) { }

  // =========================
  // CREAR
  // =========================
  async create(data: { nombre: string }) {

    try {

      // NORMALIZAR TEXTO
      data.nombre =
        data.nombre
          .trim()
          .toLowerCase()
          .replace(/\b\w/g, l => l.toUpperCase());

      // VALIDAR DUPLICADO IGNORANDO MAYÚSCULAS
      const existe =
        await this.prisma.departamentos.findFirst({
          where: {
            nombre: {
              equals: data.nombre,
              mode: 'insensitive'
            }
          }
        });

      if (existe) {
        throw new BadRequestException(
          'El departamento ya existe'
        );
      }

      const nuevoDepartamento =
        await this.prisma.departamentos.create({
          data: {
            nombre: data.nombre
          }
        });

      return {
        message: 'Departamento creado correctamente',
        data: nuevoDepartamento
      };

    } catch (error: any) {

      if (error.code === 'P2002') {
        throw new BadRequestException(
          'El departamento ya existe'
        );
      }

      throw error;
    }
  }

  // =========================
  // LISTAR TODOS
  // =========================
  async findAll() {

    return this.prisma.departamentos.findMany({
      orderBy: {
        nombre: 'asc'
      }
    });
  }

  // =========================
  // BUSCAR UNO
  // =========================
  async findOne(id: number) {

    const departamento =
      await this.prisma.departamentos.findUnique({
        where: {
          id: Number(id)
        }
      });

    if (!departamento) {
      throw new NotFoundException(
        'Departamento no encontrado'
      );
    }

    return departamento;
  }

  // =========================
  // ACTUALIZAR
  // =========================
  async update(
    id: number,
    data: { nombre: string }
  ) {

    await this.findOne(id);

    return this.prisma.departamentos.update({
      where: {
        id: Number(id)
      },

      data: {
        nombre: data.nombre
      }
    });
  }

  // =========================
  // ELIMINAR
  // =========================
  async remove(id: number) {

    await this.findOne(id);

    return this.prisma.departamentos.delete({
      where: {
        id: Number(id)
      }
    });
  }
}
