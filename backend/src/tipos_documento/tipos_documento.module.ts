import { Module } from '@nestjs/common';
import { TiposDocumentoService } from './tipos_documento.service';
import { TiposDocumentoController } from './tipos_documento.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TiposDocumentoController],
  providers: [TiposDocumentoService, PrismaService],
})
export class TiposDocumentoModule { }
