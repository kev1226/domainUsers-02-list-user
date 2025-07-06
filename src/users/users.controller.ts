import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles, Role } from 'auth-common-nestjs';
import { AuthGuard } from './common/guards/auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

/**
 * Controller that exposes a GET endpoint to list all users.
 * Access is restricted to users with ADMIN role.
 */
@ApiTags('Users')
@ApiBearerAuth()
@Controller('list')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'List all users (admin only)' })
  @ApiOkResponse({ description: 'List of users', type: [User] })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - missing or invalid token',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient role' })
  findAll() {
    return this.usersService.findAll();
  }
}
