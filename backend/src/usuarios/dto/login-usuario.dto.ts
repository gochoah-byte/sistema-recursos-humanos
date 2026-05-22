import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUsuarioDto {

    @IsEmail({}, {
        message: 'Correo inválido'
    })
    correo!: string;

    @IsString()
    @IsNotEmpty({
        message: 'La contraseña es obligatoria'
    })
    contrasena!: string;
}