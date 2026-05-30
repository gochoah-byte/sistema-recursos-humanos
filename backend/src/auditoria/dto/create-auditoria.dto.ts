import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAuditoriaDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    @IsNotEmpty()
    usuario_id!: number;

    @ApiProperty({ example: 'CREAR', description: 'La acción realizada' })
    @IsString()
    @IsNotEmpty()
    accion!: string;

    @ApiProperty({ example: 'empleados', description: 'El nombre de la tabla/entidad' })
    @IsString()
    @IsNotEmpty()
    entidad!: string;

    @ApiProperty({ example: 6, description: 'El ID del registro afectado' })
    @IsInt()
    @IsNotEmpty()
    entidad_id!: number;

    @ApiProperty({ example: 'Se creó un nuevo empleado' })
    @IsString()
    @IsOptional()
    descripcion?: string;
}