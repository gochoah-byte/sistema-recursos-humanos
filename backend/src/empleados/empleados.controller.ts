
import { Controller, Get, Post, Body, Param,Put } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { Delete } from '@nestjs/common';

@ApiTags('empleados')
@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) { }

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo empleado' })
  create(@Body() createEmpleadoDto: CreateEmpleadoDto) {
    return this.empleadosService.create(createEmpleadoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los empleados' })
  findAll() {
    return this.empleadosService.findAll();
  }

  @Get(':id')
@ApiOperation({ summary: 'Obtener empleado por ID' })
findOne(@Param('id') id: string) {
  return this.empleadosService.findOne(+id);
}
@Put(':id')
@ApiOperation({ summary: 'Actualizar empleado' })
update(@Param('id') id: string, @Body() updateEmpleadoDto: UpdateEmpleadoDto) {
  return this.empleadosService.update(+id, updateEmpleadoDto);
}

@Delete(':id')
@ApiOperation({ summary: 'Eliminar empleado' })
remove(@Param('id') id: string) {
  return this.empleadosService.remove(+id);
}

}
