import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { RegistrosAcademicosService } from './registros_academicos.service';
import { CreateRegistrosAcademicoDto } from './dto/create-registros_academico.dto';
import { UpdateRegistrosAcademicoDto } from './dto/update-registros_academico.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Formación Académica')
@Controller('registros-academicos')
export class RegistrosAcademicosController {
  constructor(private readonly registrosAcademicosService: RegistrosAcademicosService) { }

  @Post()
  @ApiOperation({ summary: 'Agregar un título al empleado' })
  create(@Body() createDto: CreateRegistrosAcademicoDto) {
    return this.registrosAcademicosService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los registros académicos del sistema' })
  findAll() {
    return this.registrosAcademicosService.findAll();
  }

  @Get('empleado/:id')
  @ApiOperation({ summary: 'Ver todos los títulos de un empleado específico' })
  findByEmpleado(@Param('id', ParseIntPipe) id: number) {
    return this.registrosAcademicosService.findByEmpleado(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro académico por su ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.registrosAcademicosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un registro académico' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRegistrosAcademicoDto,
  ) {
    return this.registrosAcademicosService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un registro académico' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.registrosAcademicosService.remove(id);
  }
}