import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { JwtService } from '@nestjs/jwt'; 
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class UsuariosService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      const contrasenaHasheada = await bcrypt.hash(createUsuarioDto.contrasena, salt);

      const nuevoUsuario = await this.prisma.usuarios.create({
        data: {
          correo: createUsuarioDto.correo,
          contrasena: contrasenaHasheada, 
          rol: createUsuarioDto.rol.toUpperCase(),
          empleado_id: createUsuarioDto.empleado_id,
        },
      });

      return {
        message: 'Usuario creado exitosamente',
        usuario: {
          id: nuevoUsuario.id,
          correo: nuevoUsuario.correo,
          rol: nuevoUsuario.rol
        }
      };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('El correo o el empleado ya tienen un usuario asignado');
      }
      throw error;
    }
  }

  async findAll() {
    const lista = await this.prisma.usuarios.findMany({
      include: { empleados: { select: { nombres: true, apellidos: true } } }
    });

    if (lista.length === 0) {
      return {
        message: 'No se encontraron usuarios registrados en el sistema',
        data: []
      };
    }
    return lista;
  }

  
  async login(correo: string, contrasena: string) {
    const user = await this.prisma.usuarios.findFirst({
      where: { correo: correo },
      include: {
        empleados: {
          select: { nombres: true, apellidos: true }
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const esValida = await bcrypt.compare(contrasena, user.contrasena);
    if (!esValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = {
      id: user.id,
      email: user.correo,
      rol: user.rol
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      usuario: {
        correo: user.correo,
        rol: user.rol,
        nombreCompleto: `${user.empleados?.nombres} ${user.empleados?.apellidos}`
      }
    };
  }

  async findOne(id: number) {
    return this.prisma.usuarios.findUnique({
      where: { id },
      include: { empleados: true }
    });
  }

  async update(id: number, updateUsuarioDto: any) {
    if (updateUsuarioDto.contrasena) {
      const salt = await bcrypt.genSalt(10);
      updateUsuarioDto.contrasena = await bcrypt.hash(updateUsuarioDto.contrasena, salt);
    }

    return this.prisma.usuarios.update({
      where: { id },
      data: updateUsuarioDto,
    });
  }

  async remove(id: number) {
    return this.prisma.usuarios.delete({
      where: { id },
    });
  }
}