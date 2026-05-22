import { PartialType } from '@nestjs/swagger';
import { CreateDetalleNominaDto } from './create-detalle_nomina.dto';

export class UpdateDetalleNominaDto extends PartialType(CreateDetalleNominaDto) {}
