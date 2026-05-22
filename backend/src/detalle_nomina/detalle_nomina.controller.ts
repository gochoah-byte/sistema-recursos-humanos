import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetalleNominaService } from './detalle_nomina.service';
import { CreateDetalleNominaDto } from './dto/create-detalle_nomina.dto';
import { UpdateDetalleNominaDto } from './dto/update-detalle_nomina.dto';

@Controller('detalle-nomina')
export class DetalleNominaController {
  constructor(private readonly detalleNominaService: DetalleNominaService) {}

  @Post()
  create(@Body() createDetalleNominaDto: CreateDetalleNominaDto) {
    return this.detalleNominaService.create(createDetalleNominaDto);
  }

  @Get()
  findAll() {
    return this.detalleNominaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleNominaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetalleNominaDto: UpdateDetalleNominaDto) {
    return this.detalleNominaService.update(+id, updateDetalleNominaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleNominaService.remove(+id);
  }
}
