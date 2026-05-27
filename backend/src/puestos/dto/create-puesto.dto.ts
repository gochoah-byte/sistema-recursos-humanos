import {
    IsString,
    MinLength,
    MaxLength,
    Matches
} from 'class-validator';

export class CreatePuestoDto {

    @IsString({
        message: 'El nombre debe ser texto'
    })

    @MinLength(2, {
        message: 'El puesto debe tener mínimo 2 caracteres'
    })

    @MaxLength(50, {
        message: 'El puesto no puede exceder 50 caracteres'
    })

    @Matches(
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
        {
            message:
                'El puesto solo puede contener letras'
        }
    )

    nombre!: string;
}