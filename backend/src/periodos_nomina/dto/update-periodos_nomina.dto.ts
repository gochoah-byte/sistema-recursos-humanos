import { PartialType } from '@nestjs/swagger';
import { CreatePeriodosNominaDto } from './create-periodos_nomina.dto';

export class UpdatePeriodosNominaDto extends PartialType(CreatePeriodosNominaDto) {}
