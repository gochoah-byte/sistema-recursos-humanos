import { PartialType } from '@nestjs/swagger';
import { CreateAjusteNominaDto } from './create-ajustes_nomina.dto';

export class UpdateAjustesNominaDto extends PartialType(CreateAjusteNominaDto) {}
