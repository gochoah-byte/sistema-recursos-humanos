import { Injectable } from '@nestjs/common';
import { CreateTiposDocumentoDto } from './dto/create-tipos_documento.dto';
import { UpdateTiposDocumentoDto } from './dto/update-tipos_documento.dto';

@Injectable()
export class TiposDocumentoService {
  create(createTiposDocumentoDto: CreateTiposDocumentoDto) {
    return 'This action adds a new tiposDocumento';
  }

  findAll() {
    return `This action returns all tiposDocumento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tiposDocumento`;
  }

  update(id: number, updateTiposDocumentoDto: UpdateTiposDocumentoDto) {
    return `This action updates a #${id} tiposDocumento`;
  }

  remove(id: number) {
    return `This action removes a #${id} tiposDocumento`;
  }
}
