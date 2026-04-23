import { Injectable } from '@nestjs/common';
import { CreateAjustesNominaDto } from './dto/create-ajustes_nomina.dto';
import { UpdateAjustesNominaDto } from './dto/update-ajustes_nomina.dto';

@Injectable()
export class AjustesNominaService {
  create(createAjustesNominaDto: CreateAjustesNominaDto) {
    return 'This action adds a new ajustesNomina';
  }

  findAll() {
    return `This action returns all ajustesNomina`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ajustesNomina`;
  }

  update(id: number, updateAjustesNominaDto: UpdateAjustesNominaDto) {
    return `This action updates a #${id} ajustesNomina`;
  }

  remove(id: number) {
    return `This action removes a #${id} ajustesNomina`;
  }
}
