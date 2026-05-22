import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAjusteNominaDto } from './dto/create-ajustes_nomina.dto';
import { UpdateAjustesNominaDto } from './dto/update-ajustes_nomina.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';

@Injectable()
export class AjustesNominaService {
  constructor(private prisma: PrismaService, private auditoriaService: AuditoriaService) { }

  async create(data: CreateAjusteNominaDto) {
      try {
        const detalleExiste =
  await this.prisma.detalles_nomina.findUnique({
    where: {
      id: data.detalle_nomina_id
    }
  });

if (!detalleExiste) {
  throw new NotFoundException(
    'Detalle de nómina no encontrado'
  );
}

const usuarioExiste =
  await this.prisma.usuarios.findUnique({
    where: {
      id: data.ajustado_por_usuario_id
    }
  });

if (!usuarioExiste) {
  throw new NotFoundException(
    'Usuario no encontrado'
  );
}
    const nuevoAjuste = await this.prisma.ajustes_nomina.create({
      data: {
        detalle_nomina_id: data.detalle_nomina_id,
        ajustado_por_usuario_id: data.ajustado_por_usuario_id,
        monto_anterior: data.monto_anterior,
        monto_nuevo: data.monto_nuevo,
        razon: data.razon,
        cambiado_en: new Date(),
      },
    });

    await this.prisma.detalles_nomina.update({
      where: { id: data.detalle_nomina_id },
      data: {
        salario_neto: data.monto_nuevo,
      },
    });

    await this.auditoriaService.create({
      usuario_id: data.ajustado_por_usuario_id, 
      accion: 'CREAR_AJUSTE_NOMINA',           
      entidad: 'ajustes_nomina',               
      entidad_id: nuevoAjuste.id,              
      descripcion: `Se ajustó el salario de la boleta ${data.detalle_nomina_id} a un nuevo monto de ${data.monto_nuevo} por la razón: ${data.razon}`,
    });

    return {
      message: 'Ajuste registrado, salario neto actualizado y auditoría guardada',
      data: nuevoAjuste,
    };
  }
   catch (error) {

  console.log(error);

  throw error;

}

}

  async findAll() {
    try {
    return await this.prisma.ajustes_nomina.findMany({
      include: {
        usuarios: {
          select: { correo: true } 
        },
        detalles_nomina: true
      },
      orderBy: { cambiado_en: 'desc' }
    });
    } catch (error) {

  console.log(error);

  throw error;

}
  }

  async findOne(id: number) {
    try {
    const ajuste = await this.prisma.ajustes_nomina.findUnique({
      where: { id },
     include: {
  usuarios: {
    select: {
      id: true,
      correo: true,
      rol: true
    }
  },
  detalles_nomina: true
}
    });

    if (!ajuste) {
      throw new NotFoundException(`El ajuste con ID ${id} no existe`);
    }

    return ajuste;
    } catch (error) {

  console.log(error);

  throw error;

}
  }

  async findByDetalleNomina(detalleId: number) {
    try {
    return await this.prisma.ajustes_nomina.findMany({
      where: { detalle_nomina_id: detalleId }
    });
    } catch (error) {

  console.log(error);

  throw error;

}
  }

  async update(id: number, data: UpdateAjustesNominaDto) {
    try {
    const existe = await this.prisma.ajustes_nomina.findUnique({ where: { id } });

    if (!existe) throw new NotFoundException('No se encontró el ajuste');

    return await this.prisma.ajustes_nomina.update({
      where: { id },
      data: {
        monto_nuevo: data.monto_nuevo,
        razon: data.razon,
      },
    });
    } catch (error) {

  console.log(error);

  throw error;

}
  }

  async remove(id: number) {
    try {
    const existe = await this.prisma.ajustes_nomina.findUnique({ where: { id } });
    if (!existe) throw new NotFoundException('No se encontró el ajuste');

    await this.prisma.ajustes_nomina.delete({ where: { id } });

    await this.auditoriaService.create({
      usuario_id: 5, 
      accion: 'ELIMINAR_AJUSTE',
      entidad: 'ajustes_nomina',
      entidad_id: id,
      descripcion: `Se eliminó el ajuste que tenía una razón de: ${existe.razon}`,
    });

    return { message: 'Ajuste eliminado y acción auditada' };
    } catch (error) {

  console.log(error);

  throw error;

}
  }
  
}
