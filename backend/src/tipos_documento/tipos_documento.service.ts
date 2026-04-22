import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTiposDocumentoDto } from './dto/create-tipos_documento.dto';
import { UpdateTiposDocumentoDto } from './dto/update-tipos_documento.dto';

@Injectable()
export class TiposDocumentoService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTiposDocumentoDto) {
    return await this.prisma.tipos_documento.create({
      data,
    });
  }

  async findAll() {
    return await this.prisma.tipos_documento.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.tipos_documento.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdateTiposDocumentoDto) {
    return await this.prisma.tipos_documento.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.tipos_documento.delete({
      where: { id },
    });
  }
}