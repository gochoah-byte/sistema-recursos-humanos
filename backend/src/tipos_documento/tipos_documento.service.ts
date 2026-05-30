import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { CreateTiposDocumentoDto } from './dto/create-tipos_documento.dto';

@Injectable()
export class TiposDocumentoService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(createDto: CreateTiposDocumentoDto) {

    try {

      const nombreNormalizado =
        createDto.nombre.trim().toUpperCase();

      if (!nombreNormalizado) {
        throw new BadRequestException(
          'El nombre no puede estar vacío'
        );
      }

      const existe =
        await this.prisma.tipos_documento.findFirst({
          where: {
            nombre: nombreNormalizado,
          },
        });

      if (existe) {
        throw new BadRequestException(
          'El tipo de documento ya existe'
        );
      }

      return await this.prisma.tipos_documento.create({
        data: {
          nombre: nombreNormalizado,
          es_obligatorio:
            createDto.es_obligatorio,
        },
      });

    } catch (error: any) {

      throw new BadRequestException(
        error.message ||
        'Error al crear tipo documento'
      );

    }

  }

  async findAll() {

    return await this.prisma.tipos_documento.findMany();

  }

  async remove(id: number) {

    return await this.prisma.tipos_documento.delete({
      where: { id },
    });

  }

}