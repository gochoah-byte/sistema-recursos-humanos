import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PeriodoNominaService } from './periodo_nomina.service';
import { CreatePeriodoNominaDto } from './dto/create-periodo_nomina.dto';
import { UpdatePeriodoNominaDto } from './dto/update-periodo_nomina.dto';

@Controller('periodo-nomina')
export class PeriodoNominaController {
  constructor(private readonly periodoNominaService: PeriodoNominaService) {}

  @Post()
  create(@Body() createPeriodoNominaDto: CreatePeriodoNominaDto) {
    return this.periodoNominaService.create(createPeriodoNominaDto);
  }

  @Get()
  findAll() {
    return this.periodoNominaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.periodoNominaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePeriodoNominaDto: UpdatePeriodoNominaDto) {
    return this.periodoNominaService.update(+id, updatePeriodoNominaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.periodoNominaService.remove(+id);
  }
}
