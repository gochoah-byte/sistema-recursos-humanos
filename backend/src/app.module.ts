import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpleadosModule } from './empleados/empleados.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RegistrosAcademicosModule } from './registros_academicos/registros_academicos.module';
import { DocumentosModule } from './documentos/documentos.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { AjustesNominaModule } from './ajustes_nomina/ajustes_nomina.module';

@Module({
  imports: [EmpleadosModule, UsuariosModule, RegistrosAcademicosModule, DocumentosModule, AuditoriaModule, AjustesNominaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
