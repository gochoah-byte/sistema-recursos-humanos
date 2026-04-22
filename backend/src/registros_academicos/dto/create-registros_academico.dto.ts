export class CreateRegistrosAcademicoDto {
  empleado_id!: number;
  tipo!: 'TITULO' | 'CERTIFICACION';
  titulo!: string;
  institucion!: string;
  fecha_graduacion!: string;
}