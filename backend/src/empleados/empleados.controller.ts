import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Empleados') 
@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) { }

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo empleado' })
  @ApiResponse({ status: 201, description: 'Empleado creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos (DPI o nombre faltante).' })
  create(@Body() createEmpleadoDto: CreateEmpleadoDto) {
    return this.empleadosService.create(createEmpleadoDto);
  }

  @Get('reportes/expedientes-incompletos')
  @ApiOperation({ summary: 'Reporte de empleados con expediente digital vacío' })
  getIncompletos() {
    return this.empleadosService.findIncompletos();
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los empleados' })
  findAll() {
    return this.empleadosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener empleado por ID' })
  @ApiResponse({ status: 200, description: 'Empleado encontrado.' })
  @ApiResponse({ status: 404, description: 'Empleado no existe.' })
  findOne(@Param('id') id: string) {
    return this.empleadosService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar información del empleado' })
  @ApiResponse({ status: 200, description: 'Empleado actualizado correctamente.' })
  @ApiResponse({ status: 404, description: 'No se encontró el empleado para actualizar.' })
  async update(@Param('id') id: string, @Body() updateEmpleadoDto: UpdateEmpleadoDto) {
    return this.empleadosService.update(+id, updateEmpleadoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  @ApiOperation({ summary: 'Eliminar empleado' })
  @ApiResponse({ status: 204, description: 'Empleado eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'El empleado no existe.' })
  remove(@Param('id') id: string) {
    return this.empleadosService.remove(+id);
  }
}