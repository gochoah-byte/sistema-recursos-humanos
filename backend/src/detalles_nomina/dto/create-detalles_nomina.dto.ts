import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateDetallesNominaDto {
    @ApiProperty({
        example: 1,
        description: 'ID del periodo de nómina (debe existir en la tabla periodos_nomina)'
    })
    @IsInt()
    @IsNotEmpty()
    periodo_nomina_id!: number;

    @ApiProperty({
        example: 6,
        description: 'ID del empleado al que se le genera la nómina'
    })
    @IsInt()
    @IsNotEmpty()
    empleado_id!: number;
}