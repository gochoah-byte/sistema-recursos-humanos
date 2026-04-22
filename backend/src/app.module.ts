import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpleadosModule } from './empleados/empleados.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RegistrosAcademicosModule } from './registros_academicos/registros_academicos.module';
import { TiposDocumentoModule } from './tipos_documento/tipos_documento.module';
import { PeriodoNominaModule } from './periodo_nomina/periodo_nomina.module';
import { DetalleNominaModule } from './detalle_nomina/detalle_nomina.module';

@Module({
  imports: [EmpleadosModule, UsuariosModule, RegistrosAcademicosModule, TiposDocumentoModule, PeriodoNominaModule, DetalleNominaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
