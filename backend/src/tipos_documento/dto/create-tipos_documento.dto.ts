import { ApiProperty } from '@nestjs/swagger';

export class CreateTiposDocumentoDto {
    @ApiProperty({ example: 'DPI' })
    nombre!: string;

    @ApiProperty({ example: true })
    es_obligatorio!: boolean;
}