import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Matches,
  MinLength,
  MaxLength,
  Min,
  IsIn
} from 'class-validator';

export class CreateEmpleadoDto {
    @ApiProperty({ example: '1234567890101' })
    @IsNotEmpty()
    @IsString()
    @Matches(/^[0-9]{13}$/, { message: 'El DPI debe tener exactamente 13 dígitos numéricos' })
    dpi!: string;

 @ApiProperty({ example: 'Jose Gerardo' })
@IsNotEmpty()
@IsString()

@MinLength(3, {
  message: 'El nombre debe tener mínimo 3 caracteres'
})

@MaxLength(60, {
  message: 'El nombre no puede exceder 60 caracteres'
})

nombres!: string;

    @ApiProperty({ example: 'Gonzalez Marroquin' })
@IsNotEmpty()
@IsString()

@MinLength(3, {
  message: 'El apellido debe tener mínimo 3 caracteres'
})

@MaxLength(60, {
  message: 'El apellido no puede exceder 60 caracteres'
})

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

@Matches(/^[0-9]{4}-[0-9]{4}$/, {
  message: 'El teléfono debe tener formato 0000-0000'
})

telefono?: string;

   @ApiProperty({ example: 3000.50 })
@IsNotEmpty()
@IsNumber()

@Min(1, {
  message: 'El salario debe ser mayor a 0'
})

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

@IsIn(['ACTIVO', 'SUSPENDIDO', 'VACACIONES'], {
  message: 'Estado inválido'
})

estado!: string;
}