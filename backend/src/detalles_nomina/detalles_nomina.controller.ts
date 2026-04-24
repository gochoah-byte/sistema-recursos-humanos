import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { DetallesNominaService } from './detalles_nomina.service';
import { CreateDetallesNominaDto } from './dto/create-detalles_nomina.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Detalles de Nomina (Cálculo)')
@Controller('detalles-nomina')
export class DetallesNominaController {
  constructor(private readonly service: DetallesNominaService) { }

  @Post()
  @ApiOperation({ summary: 'Generar línea de nómina para un empleado' })
  create(@Body() createDto: CreateDetallesNominaDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ver todos los cálculos de nómina realizados' })
  findAll() {
    return this.service.findAll();
  }
}