import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common';
import { CreatePuestoDto } from './dto/create-puesto.dto';

import { PuestoService } from './puestos.service';

@Controller('puestos')
export class PuestoController {

  constructor(
    private readonly puestoService: PuestoService
  ) { }

  // =========================
  // CREAR
  // =========================
  @Post()
  create(
    @Body() body: CreatePuestoDto
  ) {
    return this.puestoService.create(body);
  }

  // =========================
  // LISTAR TODOS
  // =========================
  @Get()
  findAll() {
    return this.puestoService.findAll();
  }

  // =========================
  // BUSCAR UNO
  // =========================
  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.puestoService.findOne(Number(id));
  }

  // =========================
  // ACTUALIZAR
  // =========================
  @Patch(':id')
  update(
    @Param('id') id: string,

    @Body() body: CreatePuestoDto
  ) {
    return this.puestoService.update(
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
    return this.puestoService.remove(
      Number(id)
    );
  }
}