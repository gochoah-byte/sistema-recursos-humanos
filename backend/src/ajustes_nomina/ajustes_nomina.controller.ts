import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AjustesNominaService } from './ajustes_nomina.service';
import { CreateAjustesNominaDto } from './dto/create-ajustes_nomina.dto';
import { UpdateAjustesNominaDto } from './dto/update-ajustes_nomina.dto';

@Controller('ajustes-nomina')
export class AjustesNominaController {
  constructor(private readonly ajustesNominaService: AjustesNominaService) {}

  @Post()
  create(@Body() createAjustesNominaDto: CreateAjustesNominaDto) {
    return this.ajustesNominaService.create(createAjustesNominaDto);
  }

  @Get()
  findAll() {
    return this.ajustesNominaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ajustesNominaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAjustesNominaDto: UpdateAjustesNominaDto) {
    return this.ajustesNominaService.update(+id, updateAjustesNominaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ajustesNominaService.remove(+id);
  }
}
