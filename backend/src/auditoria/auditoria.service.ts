import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';

@Injectable()
export class AuditoriaService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateAuditoriaDto) {
    return await this.prisma.auditoria_logs.create({
      data: {
        usuario_id: dto.usuario_id,
        accion: dto.accion,
        entidad: dto.entidad,
        entidad_id: dto.entidad_id,
        descripcion: dto.descripcion,
      },
    });
  }

  async findAll() {
    return await this.prisma.auditoria_logs.findMany({
      include: { usuarios: true },
      orderBy: { creado_en: 'desc' },
    });
  }

  async findOne(id: number) {
    return await this.prisma.auditoria_logs.findUnique({
      where: { id },
      include: { usuarios: true }
    });
  }
}