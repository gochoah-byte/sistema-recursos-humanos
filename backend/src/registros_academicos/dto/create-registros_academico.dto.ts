import { ApiProperty } from '@nestjs/swagger';

export class CreateRegistrosAcademicoDto {
  @ApiProperty({ example: 6 })
  empleado_id!: number;

  @ApiProperty({ example: 'Grado Académico' })
  tipo!: string; 

  @ApiProperty({ example: 'Ingeniería' })
  titulo!: string; 

  @ApiProperty({ example: 'UMG' })
  institucion!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  fecha_graduacion!: string;
}