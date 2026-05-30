import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEmpleadoDto } from './create-empleado.dto';

export class UpdateEmpleadoDto extends PartialType(CreateEmpleadoDto) {
    @ApiProperty({ example: 'Jose Gerardo', description: 'Nombres del empleado' })
    nombres?: string;

    @ApiProperty({ example: 'Gonzalez Marroquin', description: 'Apellidos del empleado' })
    apellidos?: string;

    @ApiProperty({ example: '1234567890101', description: 'DPI único' })
    dpi?: string;

    @ApiProperty({ example: 3500.50, description: 'Salario base mensual' })
    salario_base?: number;

    @ApiProperty({ example: 'IT', description: 'Departamento asignado' })
    departamento?: string;

    @ApiProperty({ example: 'ACTIVO', description: 'Estado actual' })
    estado?: string;
}