import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsInt, IsEnum } from 'class-validator';

export class CreateUsuarioDto {
    @ApiProperty({ example: 'admin@empresa.com' })
    @IsEmail({}, { message: 'El correo debe ser una dirección válida' })
    correo!: string;

    @ApiProperty({ example: 'Contrasena123!' })
    @IsString()
    @IsNotEmpty()
    contrasena!: string;

    @ApiProperty({
        example: 'ADMIN',
        enum: ['ADMIN', 'RRHH', 'EMPLEADO'],
        description: 'Debe ser uno de los roles permitidos en mayúsculas'
    })
    @IsEnum(['ADMIN', 'RRHH', 'EMPLEADO'])
    rol!: string;

    @ApiProperty({
        example: 1,
        required: false,
        description: 'ID del empleado asociado (opcional)'
    })
    @IsOptional()
    @IsInt()
    empleado_id?: number;
}