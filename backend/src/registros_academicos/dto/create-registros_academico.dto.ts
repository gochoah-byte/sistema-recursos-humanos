import {
  IsNotEmpty,
  IsString,
  IsNumber
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegistrosAcademicoDto {
  @ApiProperty({ example: 6 })
  @IsNotEmpty()
@IsNumber()
  empleado_id!: number;

  @ApiProperty({ example: 'Grado Académico' })
  @IsNotEmpty()
@IsString()
  tipo!: string; 

  @ApiProperty({ example: 'Ingeniería' })
  @IsNotEmpty()
@IsString()
  titulo!: string; 

  @ApiProperty({ example: 'UMG' })
  @IsNotEmpty()
@IsString()
  institucion!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  @IsNotEmpty()
@IsString()
  fecha_graduacion!: string;
}