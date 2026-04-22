import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegistrosAcademicosService } from './registros_academicos.service';
import { CreateRegistrosAcademicoDto } from './dto/create-registros_academico.dto';
import { UpdateRegistrosAcademicoDto } from './dto/update-registros_academico.dto';

@Controller('registros-academicos')
export class RegistrosAcademicosController {
  constructor(private readonly registrosAcademicosService: RegistrosAcademicosService) {}

  @Post()
  create(@Body() createRegistrosAcademicoDto: CreateRegistrosAcademicoDto) {
    return this.registrosAcademicosService.create(createRegistrosAcademicoDto);
  }

  @Get()
  findAll() {
    return this.registrosAcademicosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registrosAcademicosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegistrosAcademicoDto: UpdateRegistrosAcademicoDto) {
    return this.registrosAcademicosService.update(+id, updateRegistrosAcademicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.registrosAcademicosService.remove(+id);
  }
}
