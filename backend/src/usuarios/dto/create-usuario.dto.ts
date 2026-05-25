import { ApiProperty } from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString,
    IsOptional,
    IsInt,
    IsEnum,
    MinLength,
    MaxLength,
    Matches,
    Min
} from 'class-validator';

import { Type } from 'class-transformer';

export enum RolUsuario {
    ADMIN = 'ADMIN',
    RRHH = 'RRHH',
    EMPLEADO = 'EMPLEADO',
}

export class CreateUsuarioDto {

    @ApiProperty({
        example: 'admin@empresa.com'
    })
    @IsEmail({}, {
        message: 'El correo debe tener un formato válido'
    })
    @IsNotEmpty({
        message: 'El correo es obligatorio'
    })
    correo!: string;


    @ApiProperty({
        example: 'Contrasena123!'
    })
    @IsString({
        message: 'La contraseña debe ser texto'
    })
    @IsNotEmpty({
        message: 'La contraseña es obligatoria'
    })
    @MinLength(8, {
        message: 'La contraseña debe tener al menos 8 caracteres'
    })
    @MaxLength(20, {
        message: 'La contraseña no puede exceder 20 caracteres'
    })
    @Matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
        {
            message:
                'La contraseña debe contener mayúscula, minúscula y número'
        }
    )
    contrasena!: string;


    @ApiProperty({
        example: 'ADMIN',
        enum: RolUsuario,
        description: 'Roles permitidos'
    })
    @IsEnum(RolUsuario, {
        message: 'El rol debe ser ADMIN, RRHH o EMPLEADO'
    })
    rol!: RolUsuario;


    @ApiProperty({
        example: 1,
        required: false,
        description: 'ID del empleado asociado'
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({
        message: 'El empleado_id debe ser un número entero'
    })
    @Min(1, {
        message: 'El empleado_id debe ser mayor que 0'
    })
    empleado_id?: number;
}