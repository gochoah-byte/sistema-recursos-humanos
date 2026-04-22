import { PartialType } from '@nestjs/swagger';
import { CreateAjustesNominaDto } from './create-ajustes_nomina.dto';

export class UpdateAjustesNominaDto extends PartialType(CreateAjustesNominaDto) {}
