import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpleadosModule } from './empleados/empleados.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RegistrosAcademicosModule } from './registros_academicos/registros_academicos.module';
import { DocumentosModule } from './documentos/documentos.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { AjustesNominaModule } from './ajustes_nomina/ajustes_nomina.module';
import { TiposDocumentoModule } from './tipos_documento/tipos_documento.module';
import { PeriodosNominaModule } from './periodos_nomina/periodos_nomina.module';
import { DetallesNominaModule } from './detalles_nomina/detalles_nomina.module';
import { PuestosModule } from './puestos/puestos.module';
import { DepartamentoModule } from './departamentos/departamentos.module';


@Module({
  imports: [EmpleadosModule, UsuariosModule, RegistrosAcademicosModule, DocumentosModule, AuditoriaModule, AjustesNominaModule, TiposDocumentoModule, PeriodosNominaModule, DetallesNominaModule, PuestosModule, DepartamentoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}