import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsOptional,
    IsInt,
    IsEnum,
    MinLength,
    MaxLength,
    Matches,
    Min
} from 'class-validator';

export enum RolUsuario {
    ADMIN = 'ADMIN',
    RRHH = 'RRHH',
    EMPLEADO = 'EMPLEADO'
}

export class CreateUsuarioDto {

    @ApiProperty({ example: 'admin@empresa.com' })
    @IsEmail({}, { message: 'El correo debe ser válido' })
    @IsNotEmpty({ message: 'El correo es obligatorio' })
    correo!: string;

    @ApiProperty({ example: 'Contrasena123!' })
    @IsString({ message: 'La contraseña debe ser texto' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(8, {
        message: 'La contraseña debe tener mínimo 8 caracteres'
    })
    @MaxLength(20, {
        message: 'La contraseña no puede exceder 20 caracteres'
    })
    @Matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/,
        {
            message:
                'La contraseña debe tener mayúsculas, minúsculas, números y símbolos'
        }
    )
    contrasena!: string;

    @ApiProperty({
        example: 'ADMIN',
        enum: RolUsuario
    })
    @IsEnum(RolUsuario, {
        message: 'Rol inválido'
    })
    rol!: RolUsuario;

    @ApiProperty({
        example: 1,
        required: false
    })
    @IsOptional()
    @IsInt({ message: 'El ID del empleado debe ser entero' })
    @Min(1, { message: 'El ID debe ser mayor que 0' })
    empleado_id?: number;
}