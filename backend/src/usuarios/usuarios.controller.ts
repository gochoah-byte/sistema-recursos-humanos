import { Controller, Get, Post, Body, Patch, Put, Param, Delete } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { LoginUsuarioDto } from './dto/login-usuario.dto';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }
 
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener Token JWT' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        correo: { type: 'string', example: 'admin@empresa.com' },
        contrasena: { type: 'string', example: 'clave123' }
      }
    }
  })
  
 async login(@Body() body: LoginUsuarioDto) {
    return this.usuariosService.login(body.correo, body.contrasena);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar información del usuario' })
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Put(':id')
@ApiOperation({ summary: 'Actualizar usuario con PUT' })
updatePut(
  @Param('id') id: string,
  @Body() updateUsuarioDto: UpdateUsuarioDto,
) {
  return this.usuariosService.update(+id, updateUsuarioDto);
}

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario' })
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
