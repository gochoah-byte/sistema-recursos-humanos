import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common';

import { DepartamentoService } from './departamentos.service';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';

@Controller('departamentos')
export class DepartamentoController {

  constructor(
    private readonly departamentoService: DepartamentoService
  ) { }

  // =========================
  // CREAR
  // =========================
  @Post()
  create(
    @Body() body: CreateDepartamentoDto
  ) {
    return this.departamentoService.create(body);
  }

  // =========================
  // LISTAR TODOS
  // =========================
  @Get()
  findAll() {
    return this.departamentoService.findAll();
  }

  // =========================
  // BUSCAR UNO
  // =========================
  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.departamentoService.findOne(
      Number(id)
    );
  }

  // =========================
  // ACTUALIZAR
  // =========================
  @Patch(':id')
  update(
    @Param('id') id: string,

    @Body() body: CreateDepartamentoDto
  ) {
    return this.departamentoService.update(
      Number(id),
      body
    );
  }
  

  // =========================
  // ELIMINAR
  // =========================
  @Delete(':id')
  remove(
    @Param('id') id: string
  ) {
    return this.departamentoService.remove(
      Number(id)
    );
  }
}
