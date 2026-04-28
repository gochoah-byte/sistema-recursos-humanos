import { PartialType } from '@nestjs/swagger';
import { CreateDetallesNominaDto } from './create-detalles_nomina.dto';

export class UpdateDetallesNominaDto extends PartialType(CreateDetallesNominaDto) {}
