import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistrosAcademicoDto } from './create-registros_academico.dto';

export class UpdateRegistrosAcademicoDto extends PartialType(CreateRegistrosAcademicoDto) {}