import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';

@Injectable()
export class DocumentosService {
  constructor(private prisma: PrismaService, private auditoriaService: AuditoriaService) { }

  async saveMetadata(data: {
    nombre_archivo: string;
    url_archivo: string;
    empleado_id: number;
    tipo_documento_id: number;
    subido_por_usuario_id: number;
  }) {
    // 1. Creamos el registro del documento
    const nuevoDoc = await this.prisma.documentos.create({
      data: {
        nombre_archivo: data.nombre_archivo,
        url_archivo: data.url_archivo,
        empleado_id: data.empleado_id,
        tipo_documento_id: data.tipo_documento_id,
        subido_por_usuario_id: data.subido_por_usuario_id,
        subido_en: new Date(), // Aseguramos la fecha
      },
    });

    // 2. Registramos la auditoría (Esto es lo que faltaba)
    await this.auditoriaService.create({
      usuario_id: data.subido_por_usuario_id,
      accion: 'SUBIR_DOCUMENTO',
      entidad: 'documentos',
      entidad_id: nuevoDoc.id,
      descripcion: `Se cargó el documento ${data.nombre_archivo} para el empleado ID ${data.empleado_id}`,
    });

    return nuevoDoc;
  }

  async findByEmpleado(empleadoId: number) {
    const docs = await this.prisma.documentos.findMany({
      where: { empleado_id: empleadoId },
      include: {
        tipos_documento: true,
        usuarios: {
          select: { correo: true }
        }
      }
    });
    return docs;
  }
  async remove(id: number) {
    const documento = await this.prisma.documentos.findUnique({ where: { id } });

    if (!documento) {
      throw new NotFoundException(`El documento con ID ${id} no existe`);
    }

   

    return this.prisma.documentos.delete({
      where: { id },
    });
  }

  async validarExpediente(empleadoId: number) {
    const tiposObligatorios = await this.prisma.tipos_documento.findMany({
      where: { es_obligatorio: true }
    });

    const documentosSubidos = await this.prisma.documentos.findMany({
      where: { empleado_id: empleadoId }
    });

    const idsSubidos = documentosSubidos.map(d => d.tipo_documento_id);
    const faltantes = tiposObligatorios.filter(t => !idsSubidos.includes(t.id));

    return {
      empleado_id: empleadoId,
      estado: faltantes.length === 0 ? 'Completo' : 'Incompleto',
      faltantes: faltantes.map(f => f.nombre),
      total_obligatorios: tiposObligatorios.length,
      subidos: documentosSubidos.length
    };
  }

  async create(dto: CreateDocumentoDto) {
    const nuevoDoc = await this.prisma.documentos.create({
      data: { ...dto, subido_en: new Date() }
    });

    await this.auditoriaService.create({
      usuario_id: dto.subido_por_usuario_id,
      accion: 'SUBIR_DOCUMENTO',
      entidad: 'documentos',
      entidad_id: nuevoDoc.id,
      descripcion: `Se cargó el documento ${dto.nombre_archivo} para el empleado ID ${dto.empleado_id}`
    });

    return nuevoDoc;
  }

async guardarArchivoBase64(
  archivoBase64: string,
  nombreArchivo: string
) {

  // convertir base64 a buffer
  const buffer = Buffer.from(
    archivoBase64,
    'base64'
  );

  // nombre único
  const fileName = `${Date.now()}-${nombreArchivo}`;

  // ruta uploads
  const uploadPath = path.join(
    process.cwd(),
    'uploads'
  );

  // crear carpeta
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }

  // ruta final
  const filePath = path.join(
    uploadPath,
    fileName
  );

  // guardar físico
  fs.writeFileSync(filePath, buffer);

  // devolver nombre guardado
  return fileName;
}

async obtenerBase64(id: number) {

  const documento =
    await this.prisma.documentos.findUnique({
      where: { id }
    });

  if (!documento) {
    throw new NotFoundException(
      'Documento no encontrado'
    );
  }

  return {
    nombre_archivo: documento.nombre_archivo,
    base64: documento.url_archivo
  };
}

}
