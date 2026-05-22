import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min
} from 'class-validator';

export class CreateDocumentoDto {

  @ApiProperty({
    example: 'dpi.pdf'
  })
  @IsNotEmpty()
  @IsString()
  nombre_archivo!: string;

  @ApiProperty({
    example: 'base64string'
  })
  @IsNotEmpty()
  @IsString()
  url_archivo!: string;

  @ApiProperty({
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  tipo_documento_id!: number;

  @ApiProperty({
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  empleado_id!: number;

  @ApiProperty({
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  subido_por_usuario_id!: number;
}