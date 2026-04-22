import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt'; 
import { PassportModule } from '@nestjs/passport'; 

@Module({
  imports: [PassportModule, JwtModule.register(
    {
      secret: 'CLAVE_SECRETA_UMG_2026', 
      signOptions: { expiresIn: '8h' }, 
    }),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, PrismaService],
  exports: [UsuariosService],
})
export class UsuariosModule { }
