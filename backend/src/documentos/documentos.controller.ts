import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Param, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { DocumentosService } from './documentos.service';
import { ApiConsumes, ApiBody, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Documentos')
@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) { }

  @Post('upload')
  @ApiOperation({ summary: 'Subir un documento al expediente del empleado' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'Archivo físico (PDF o Imagen)' },
        empleado_id: { type: 'number', example: 1 },
        tipo_documento_id: { type: 'number', example: 2 },
        subido_por_usuario_id: { type: 'number', example: 1 },
      },
      required: ['file', 'empleado_id', 'tipo_documento_id', 'subido_por_usuario_id']
    },
  })
  @ApiResponse({ status: 201, description: 'Documento subido y registrado con éxito.' })
  @ApiResponse({ status: 400, description: 'Error en la carga o datos faltantes.' })
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    if (!file) {
  throw new BadRequestException('No se ha seleccionado ningún archivo');
}


// VALIDAR TIPO ARCHIVO

const tiposPermitidos = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg'
];

if (
  !tiposPermitidos.includes(file.mimetype)
) {

  throw new BadRequestException(
    'Solo se permiten archivos PDF, PNG y JPG'
  );
}


// VALIDAR TAMAÑO

const maxSize = 5 * 1024 * 1024;

if (file.size > maxSize) {

  throw new BadRequestException(
    'El archivo supera el límite de 5MB'
  );
}
    // Convertimos a número porque en multipart/form-data llegan como strings
    const metadata = {
  nombre_archivo: file.originalname,
  url_archivo: file.buffer.toString('base64'),
  empleado_id: Number(body.empleado_id),
  tipo_documento_id: Number(body.tipo_documento_id),
  subido_por_usuario_id: Number(body.subido_por_usuario_id)
};

console.log('BODY:', body);
console.log('METADATA:', metadata);

return this.documentosService.saveMetadata(metadata);

    return this.documentosService.saveMetadata(metadata);
  }

  @Get('empleado/:id/validacion')
  @ApiOperation({ summary: 'Verificar si el expediente del empleado está completo' })
  async validar(@Param('id') id: string) {
    return this.documentosService.validarExpediente(+id);
  }

  @Get('empleado/:id')
  @ApiOperation({ summary: 'Listar todos los documentos de un empleado' })
  @ApiResponse({ status: 200, description: 'Lista de documentos encontrada.' })
  @ApiResponse({ status: 404, description: 'El empleado no tiene documentos o no existe.' })
  
  async findAllByEmpleado(@Param('id') id: string) {
    const documentos = await this.documentosService.findByEmpleado(+id);
    return documentos;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un documento del expediente' })
  @ApiResponse({ status: 200, description: 'Documento eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'El documento no existe.' })
  async remove(@Param('id') id: string) {
    return this.documentosService.remove(+id);
  }

@Get(':id/base64')
async obtenerDocumento(
  @Param('id') id: string
) {

  return this.documentosService.obtenerBase64(+id);
}
  
}