import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, Matches, MaxLength, MinLength, Min, MaxDate, ValidateIf } from 'class-validator';

export class CreateEmpleadoDto {
    @ApiProperty({ example: '1234567890101' })
    @IsNotEmpty()
    @IsString()
    @Matches(/^[0-9]{13}$/, { message: 'El DPI debe tener exactamente 13 dígitos numéricos' })
    dpi!: string;

    @ApiProperty({ example: 'Jose Gerardo' })
    @IsNotEmpty({message: 'Los nombres son obligatorios'})
    @IsString({message: 'Los nombres deben ser texto'})
    @MinLength(3, {message: 'Los nombres deben tener al menos 3 caracteres'})
    @MaxLength(50, {message: 'Los nombres no pueden exceder 50 caracteres'})
    @Matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/, {message: 'Los nombres solo pueden contener letras'})
    nombres!: string;


    @ApiProperty({ example: 'Gonzalez Marroquin' })
    @IsNotEmpty({message: 'Los apellidos son obligatorios'})
    @IsString({message: 'Los apellidos deben ser texto'})
    @MinLength(3, {message: 'Los apellidos deben tener al menos 3 caracteres'})
    @MaxLength(50, {message: 'Los apellidos no pueden exceder 50 caracteres'})
    @Matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/, {message: 'Los apellidos solo pueden contener letras'})
    apellidos!: string;

    @ApiProperty({ example: '2000-01-01' })
    @IsNotEmpty({
        message: 'La fecha de nacimiento es obligatoria'
    })
    @IsDateString({}, {
        message: 'La fecha de nacimiento debe tener formato YYYY-MM-DD'
    })
    fecha_nacimiento!: string;

    @ApiProperty({ example: 'Chiquimulilla, Santa Rosa' })
    @IsNotEmpty({message: 'La dirección es obligatoria'})
    @IsString({message: 'La dirección debe ser texto'})
    @MinLength(5, {message: 'La dirección debe tener al menos 5 caracteres'})
    @MaxLength(100, { message: 'La dirección no puede exceder 100 caracteres'})
    direccion!: string;

    @ApiProperty({ example: '5535-4912', required: false })
    @IsOptional()
    @Matches(/^[0-9]{4}-[0-9]{4}$/, {message: 'El teléfono debe tener formato 1234-5678'})
    telefono?: string;

    @ApiProperty({ example: 3000.50 })
    @IsNotEmpty({message: 'El salario base es obligatorio'})
    @IsNumber({}, {message: 'El salario debe ser numérico'})
    @Min(1, {message: 'El salario debe ser mayor a 0' })
    salario_base!: number;

    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @IsNumber(
        {},
        { message: 'El puesto debe ser numérico' }
    )
    puesto_id?: number;

    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @IsNumber(
        {},
        { message: 'El departamento debe ser numérico' }
    )
    departamento_id?: number;

    @ApiProperty({ example: 'ACTIVO' })
    @IsNotEmpty()
    @IsString()
    estado!: string;
}