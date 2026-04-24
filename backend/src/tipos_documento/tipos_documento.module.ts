import { Module } from '@nestjs/common';
import { TiposDocumentoService } from './tipos_documento.service';
import { TiposDocumentoController } from './tipos_documento.controller';
import { PrismaService } from '../prisma.service'; // 1. Verifica que la ruta a prisma.service sea la correcta

@Module({
  controllers: [TiposDocumentoController],
  // 2. IMPORTANTE: Agrega PrismaService aquí abajo
  providers: [TiposDocumentoService, PrismaService],
})
export class TiposDocumentoModule { }
