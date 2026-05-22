import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString
} from 'class-validator';

export class CreateAjusteNominaDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
@IsNumber()
    detalle_nomina_id!: number; 

    @ApiProperty({ example: 5 })
    @IsNotEmpty()
@IsNumber()
    ajustado_por_usuario_id!: number; 

    @ApiProperty({ example: 3500.00 })
    @IsNotEmpty()
@IsNumber()
    monto_anterior!: number;

    @ApiProperty({ example: 3800.00 })
    @IsNotEmpty()
@IsNumber()
    monto_nuevo!: number; 

    @ApiProperty({ example: 'Bono por desempeño' })
    @IsNotEmpty()
@IsString()
    razon!: string;
}