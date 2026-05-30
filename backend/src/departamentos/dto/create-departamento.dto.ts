import {
    IsString,
    MinLength,
    MaxLength,
    Matches
} from 'class-validator';

export class CreateDepartamentoDto {

    @IsString({
        message: 'El nombre debe ser texto'
    })

    @MinLength(2, {
        message:
            'El departamento debe tener mínimo 2 caracteres'
    })

    @MaxLength(50, {
        message:
            'El departamento no puede exceder 50 caracteres'
    })

    @Matches(
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
        {
            message:
                'El departamento solo puede contener letras'
        }
    )

    nombre!: string;
}