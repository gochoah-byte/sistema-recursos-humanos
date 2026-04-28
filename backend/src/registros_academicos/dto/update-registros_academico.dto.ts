import { PartialType } from '@nestjs/swagger';
import { CreateRegistrosAcademicoDto } from './create-registros_academico.dto';

export class UpdateRegistrosAcademicoDto extends PartialType(CreateRegistrosAcademicoDto) { }