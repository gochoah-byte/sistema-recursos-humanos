import { ApiProperty } from '@nestjs/swagger';

export class CreateAjusteNominaDto {
    @ApiProperty({ example: 1 })
    detalle_nomina_id!: number; 

    @ApiProperty({ example: 5 })
    ajustado_por_usuario_id!: number; 

    @ApiProperty({ example: 3500.00 })
    monto_anterior!: number;

    @ApiProperty({ example: 3800.00 })
    monto_nuevo!: number; 

    @ApiProperty({ example: 'Bono por desempeño' })
    razon!: string;
}