import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles, Role } from 'auth-common-nestjs';
import { AuthGuard } from './common/guards/auth.guard';

@Controller('list')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard) // Usamos el guard para proteger la ruta
  @Roles(Role.ADMIN) // Usamos el decorador para asignar roles (en este caso 'admin')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
