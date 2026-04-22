
import { Controller, Get, Post, Body } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

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

}
