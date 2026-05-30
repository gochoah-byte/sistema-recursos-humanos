import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  InternalServerErrorException
} from '@nestjs/common';

import { AuditoriaService } from './auditoria.service';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse
} from '@nestjs/swagger';

@ApiTags('Auditoría')
@Controller('auditoria')
export class AuditoriaController {
  constructor(
    private readonly service: AuditoriaService
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar un evento manual'
  })
  @ApiResponse({
    status: 201,
    description: 'Evento registrado con éxito.'
  })
  async create(
    @Body() dto: CreateAuditoriaDto
  ) {
    try {

      return await this.service.create(dto);

    } catch (error) {

      console.error(error);

      throw new InternalServerErrorException(
        'Error registrando auditoría'
      );

    }
  }

  @Get()
  @ApiOperation({
    summary: 'Consultar toda la bitácora'
  })
  async findAll() {
    try {

      return await this.service.findAll();

    } catch (error) {

      console.error(error);

      throw new InternalServerErrorException(
        'Error obteniendo auditoría'
      );

    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Consultar un evento específico por ID'
  })
  async findOne(
    @Param('id', ParseIntPipe)
    id: number
  ) {
    try {

      return await this.service.findOne(id);

    } catch (error) {

      console.error(error);

      throw new InternalServerErrorException(
        'Error obteniendo evento'
      );

    }
  }
}