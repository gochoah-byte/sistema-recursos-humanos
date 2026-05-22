export class CreatePeriodoNominaDto {
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'ABIERTO' | 'CERRADO';
}