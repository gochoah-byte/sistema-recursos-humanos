import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AuditoriaService } from './auditoria.service';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auditoría') 
@Controller('auditoria')
export class AuditoriaController {
  constructor(private readonly service: AuditoriaService) { }

  @Post()
  @ApiOperation({
    summary: 'Registrar un evento manual' })
  @ApiResponse({ status: 201, description: 'Evento registrado con éxito.' })
  create(@Body() dto: CreateAuditoriaDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Consultar toda la bitácora' })
  @ApiResponse({ status: 200, description: 'Lista de eventos obtenida correctamente.' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar un evento específico por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}