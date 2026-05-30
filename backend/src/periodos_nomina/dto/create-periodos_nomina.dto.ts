import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreatePeriodosNominaDto {

  @ApiProperty({
    example: '2026-04-01',
    description: 'Fecha de inicio del periodo',
  })

  @IsNotEmpty({
    message: 'La fecha inicio es obligatoria',
  })

  @IsDateString(
    {},
    {
      message: 'La fecha inicio no es válida',
    },
  )

  fecha_inicio!: string;

  @ApiProperty({
    example: '2026-04-30',
    description: 'Fecha de fin del periodo',
  })

  @IsNotEmpty({
    message: 'La fecha fin es obligatoria',
  })

  @IsDateString(
    {},
    {
      message: 'La fecha fin no es válida',
    },
  )

  fecha_fin!: string;

  @ApiProperty({
    example: 'ABIERTO',
    description:
      'Estado del periodo',
  })

 

@IsOptional()

estado?: string;

 

}