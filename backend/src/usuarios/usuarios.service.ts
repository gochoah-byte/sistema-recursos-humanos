import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      const nuevoUsuario = await this.prisma.usuarios.create({
        data: {
          correo: createUsuarioDto.correo,
          contrasena: createUsuarioDto.contrasena, 
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
    const lista = await this.prisma.usuarios.findMany();

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
      where: {
        correo: correo,
        contrasena: contrasena, 
      },
      include: {
        empleados: {
          select: { nombres: true, apellidos: true } 
        }
      }
    });
    return user;
  }

  async findOne(id: number) {
    return this.prisma.usuarios.findUnique({
      where: { id },
      include: { empleados: true }
    });
  }

  async update(id: number, updateUsuarioDto: any) {
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