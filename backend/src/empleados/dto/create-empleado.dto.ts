import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, Matches } from 'class-validator';

export class CreateEmpleadoDto {
    @ApiProperty({ example: '1234567890101' })
    @IsNotEmpty()
    @IsString()
    @Matches(/^[0-9]{13}$/, { message: 'El DPI debe tener exactamente 13 dígitos numéricos' })
    dpi!: string;

    @ApiProperty({ example: 'Jose Gerardo' })
    @IsNotEmpty()
    @IsString()
    nombres!: string;

    @ApiProperty({ example: 'Gonzalez Marroquin' })
    @IsNotEmpty()
    @IsString()
    apellidos!: string;

    @ApiProperty({ example: '2026-01-01', required: false })
    @IsOptional()
    @IsDateString() 
    fecha_nacimiento?: string;

    @ApiProperty({ example: 'Chiquimulilla, Santa Rosa', required: false })
    @IsOptional()
    @IsString()
    direccion?: string;

    @ApiProperty({ example: '5535-4912', required: false })
    @IsOptional()
    @IsString()
    telefono?: string;

    @ApiProperty({ example: 3000.50 })
    @IsNotEmpty()
    @IsNumber()
    salario_base!: number;

    @ApiProperty({ example: 'Desarrollador', required: false })
    @IsOptional()
    @IsString()
    puesto?: string;

    @ApiProperty({ example: 'IT', required: false })
    @IsOptional()
    @IsString()
    departamento?: string;

    @ApiProperty({ example: 'ACTIVO' })
    @IsNotEmpty()
    @IsString()
    estado!: string;
}