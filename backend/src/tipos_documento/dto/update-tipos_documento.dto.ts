import { PartialType } from '@nestjs/mapped-types';
import { CreateTiposDocumentoDto } from './create-tipos_documento.dto';

export class UpdateTiposDocumentoDto extends PartialType(CreateTiposDocumentoDto) {}
