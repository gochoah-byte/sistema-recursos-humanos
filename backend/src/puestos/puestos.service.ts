import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';

import { PrismaService } from '../prisma.service';

@Injectable()
export class PuestoService {

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

      // VALIDAR DUPLICADOS IGNORANDO MAYÚSCULAS
      const existe =
        await this.prisma.puestos.findFirst({
          where: {
            nombre: {
              equals: data.nombre,
              mode: 'insensitive'
            }
          }
        });

      if (existe) {
        throw new BadRequestException(
          'El puesto ya existe'
        );
      }

      const nuevoPuesto =
        await this.prisma.puestos.create({
          data: {
            nombre: data.nombre
          }
        });

      return {
        message: 'Puesto creado correctamente',
        data: nuevoPuesto
      };

    } catch (error: any) {

      if (error.code === 'P2002') {
        throw new BadRequestException(
          'El puesto ya existe'
        );
      }

      throw error;
    }
  }

  // =========================
  // LISTAR
  // =========================
  async findAll() {

    return this.prisma.puestos.findMany({
      orderBy: {
        nombre: 'asc'
      }
    });
  }

  // =========================
  // BUSCAR UNO
  // =========================
  async findOne(id: number) {

    const puesto = await this.prisma.puestos.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!puesto) {
      throw new NotFoundException(
        'Puesto no encontrado'
      );
    }

    return puesto;
  }

  // =========================
  // ACTUALIZAR
  // =========================
  async update(
    id: number,
    data: { nombre: string }
  ) {

    await this.findOne(id);

    return this.prisma.puestos.update({
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

    return this.prisma.puestos.delete({
      where: {
        id: Number(id)
      }
    });
  }
}