import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AjustesNominaService } from './ajustes_nomina.service';
import { CreateAjusteNominaDto } from './dto/create-ajustes_nomina.dto';
import { UpdateAjustesNominaDto } from './dto/update-ajustes_nomina.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Ajustes de Nomina') 
@Controller('ajustes-nomina')
export class AjustesNominaController {
  constructor(private readonly ajustesNominaService: AjustesNominaService) { }

  @Post()
  @ApiOperation({
    summary: 'Registrar un ajuste (Bono o Descuento)'})
  create(@Body() createDto: CreateAjusteNominaDto) {
    return this.ajustesNominaService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ver historial de todos los ajustes realizados' })
  findAll() {
    return this.ajustesNominaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar un ajuste específico por su ID' })
  @ApiParam({ name: 'id', description: 'ID del ajuste de nómina' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ajustesNominaService.findOne(id);
  }

  @Get('detalle/:id')
  @ApiOperation({ summary: 'Ver todos los ajustes aplicados a una línea de nómina' })
  findByDetalle(@Param('id', ParseIntPipe) id: number) {
    return this.ajustesNominaService.findByDetalleNomina(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar la razón o monto de un ajuste' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAjustesNominaDto
  ) {
    return this.ajustesNominaService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un ajuste registrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ajustesNominaService.remove(id);
  }
}
