import { PartialType } from '@nestjs/swagger';
import { CreatePeriodoNominaDto } from './create-periodo_nomina.dto';

export class UpdatePeriodoNominaDto extends PartialType(CreatePeriodoNominaDto) {}
