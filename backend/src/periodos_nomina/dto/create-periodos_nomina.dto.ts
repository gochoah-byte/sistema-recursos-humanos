import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePeriodosNominaDto {
    @ApiProperty({ example: '2026-04-01', description: 'Fecha de inicio del periodo' })
    @IsNotEmpty()
    @IsString()
    fecha_inicio!: string;

    @ApiProperty({ example: '2026-04-30', description: 'Fecha de fin del periodo' })
    @IsNotEmpty()
    @IsString()
    fecha_fin!: string;

    @ApiProperty({ example: 'ABIERTO', description: 'Estado del periodo (ABIERTO, CERRADO, PROCESADO)' })
    @IsOptional()
    @IsString()
    estado?: string;
}