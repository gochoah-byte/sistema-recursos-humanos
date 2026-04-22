import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpleadosModule } from './empleados/empleados.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RegistrosAcademicosModule } from './registros_academicos/registros_academicos.module';

@Module({
  imports: [EmpleadosModule, UsuariosModule, RegistrosAcademicosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
