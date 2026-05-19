import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTiposDocumentoDto } from './dto/create-tipos_documento.dto';
import { TiposDocumentoService } from './tipos_documento.service';

@ApiTags('Tipos de Documentos') 
@Controller('tipos-documento')
export class TiposDocumentoController {
  constructor(
  private readonly tiposDocumentoService:
    TiposDocumentoService
) {}

  @Post()
  @ApiOperation({ summary: 'Configurar un nuevo tipo de documento obligatorio o no' })
  @ApiResponse({ status: 201, description: 'Tipo de documento creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() createDto: CreateTiposDocumentoDto) {
    return this.tiposDocumentoService.create(
  createDto
);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de documentos' })
  findAll() {
  return this.tiposDocumentoService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tipo de documento' })
  remove(@Param('id', ParseIntPipe) id: number) {
   return this.tiposDocumentoService.remove(
  id
);
  }
}
