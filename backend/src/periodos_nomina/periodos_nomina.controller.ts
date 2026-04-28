import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PeriodosNominaService } from './periodos_nomina.service';
import { CreatePeriodosNominaDto } from './dto/create-periodos_nomina.dto'; 
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Nómina - Periodos')
@Controller('periodos-nomina')
export class PeriodosNominaController {
  constructor(private readonly service: PeriodosNominaService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo periodo de nómina' })
  create(@Body() createDto: CreatePeriodosNominaDto) { 
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los periodos' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un periodo por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
