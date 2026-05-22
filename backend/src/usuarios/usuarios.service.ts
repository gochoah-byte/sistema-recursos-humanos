import { Injectable, ConflictException, UnauthorizedException, NotFoundException} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { JwtService } from '@nestjs/jwt'; 
import * as bcrypt from 'bcrypt'; 
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    if (createUsuarioDto.empleado_id) {

  const empleadoExiste = await this.prisma.empleados.findUnique({
    where: {
      id: createUsuarioDto.empleado_id
    }
  });

  if (!empleadoExiste) {
    throw new NotFoundException(
      `El empleado con ID ${createUsuarioDto.empleado_id} no existe`
    );
  }
}
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
    select: {
      id: true,
      correo: true,
      rol: true,
      empleado_id: true,
      empleados: {
        select: {
          nombres: true,
          apellidos: true
        }
      }
    }
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
        empleado_id: user.empleado_id, // ESTA ES LA LÍNEA QUE ARREGLA EL DASHBOARD DEL EMPLEADO
        nombreCompleto: `${user.empleados?.nombres} ${user.empleados?.apellidos}`
      }
    };
  }

  async findOne(id: number) {
    const usuarioId = Number(id);
    if (isNaN(usuarioId) || usuarioId === 0) return null;

    const usuario = await this.prisma.usuarios.findUnique({
<<<<<<< HEAD
      where: { id: usuarioId },
      include: {
        empleados: {
          select: { nombres: true, apellidos: true }
        }
=======
  where: { id },
  select: {
    id: true,
    correo: true,
    rol: true,
    empleado_id: true,
    empleados: {
      select: {
        nombres: true,
        apellidos: true
>>>>>>> Feature/backend-validations
      }
    }
  }
});

    if (!usuario) {
      throw new NotFoundException(`El usuario con ID ${id} no existe en la base de datos`);
    }

    return usuario;
  }

<<<<<<< HEAD
  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {  
    const usuarioId = Number(id);
    const usuarioExistente = await this.prisma.usuarios.findUnique({ where: { id: usuarioId } });
    
    if (!usuarioExistente) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
=======
 async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
>>>>>>> Feature/backend-validations

  const usuarioExistente = await this.prisma.usuarios.findUnique({
    where: { id }
  });

<<<<<<< HEAD
    try {
      return await this.prisma.usuarios.update({
        where: { id: usuarioId },
        data: updateUsuarioDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Este empleado ya tiene un usuario asignado o el correo está en uso.');
        }
=======
  if (!usuarioExistente) {
    throw new NotFoundException(
      `Usuario con ID ${id} no encontrado`
    );
  }

  if (updateUsuarioDto.empleado_id) {

    const empleadoExiste = await this.prisma.empleados.findUnique({
      where: {
        id: updateUsuarioDto.empleado_id
>>>>>>> Feature/backend-validations
      }
    });

    if (!empleadoExiste) {
      throw new NotFoundException(
        `El empleado con ID ${updateUsuarioDto.empleado_id} no existe`
      );
    }
  }

  if (updateUsuarioDto.contrasena) {
    updateUsuarioDto.contrasena = await bcrypt.hash(
      updateUsuarioDto.contrasena,
      10
    );
  }

  if (updateUsuarioDto.rol) {
  updateUsuarioDto.rol =
    updateUsuarioDto.rol.toUpperCase() as any;
}

  try {

    return await this.prisma.usuarios.update({
      where: { id },
      data: updateUsuarioDto,
    });

  } catch (error) {

    if (error instanceof Prisma.PrismaClientKnownRequestError) {

      if (error.code === 'P2002') {
        throw new ConflictException(
          'Este empleado ya tiene un usuario asignado.'
        );
      }
    }

    throw error;
  }
}

  async remove(id: number) {
    const usuarioId = Number(id);
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException(`No se puede eliminar: El usuario con ID ${id} no existe.`);
    }
    
    return this.prisma.usuarios.delete({
      where: { id: usuarioId },
    });
  }
}