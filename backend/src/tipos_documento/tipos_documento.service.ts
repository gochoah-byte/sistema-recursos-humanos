import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { CreateTiposDocumentoDto } from './dto/create-tipos_documento.dto';

@Injectable()
export class TiposDocumentoService {

  constructor(
    private prisma: PrismaService
  ) {}

  async create(
    createDto: CreateTiposDocumentoDto
  ) {

    try {

      const existe =
        await this.prisma.tipos_documento.findFirst({
          where: {
            nombre: createDto.nombre
          }
        });

      if (existe) {
        throw new BadRequestException(
          'El tipo de documento ya existe'
        );
      }

      return await this.prisma.tipos_documento.create({
        data: {
          nombre: createDto.nombre,
          es_obligatorio:
            createDto.es_obligatorio,
        },
      });

    } 
    catch (error) {

  console.log(error);

  throw error;

}

  }

  async findAll() {

    try {

      return await this.prisma.tipos_documento.findMany();

    } 
    catch (error) {

  console.log(error);

  throw error;

}
  }

  async remove(id: number) {

    try {

      const existe =
        await this.prisma.tipos_documento.findUnique({
          where: { id }
        });

      if (!existe) {
        throw new NotFoundException(
          'Tipo de documento no encontrado'
        );
      }

      return await this.prisma.tipos_documento.delete({
        where: { id }
      });

    } 
    catch (error) {

  console.log(error);

  throw error;



    }

  }

}