import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../decorators/auth.decorator';

/**
 * AuthGuard that:
 * - Validates JWT token from Authorization header
 * - Extracts user payload and attaches it to the request
 * - Checks if user has required roles using @Roles decorator
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the roles defined by the @Roles decorator, if any
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;

    // Extract the token from the Authorization header
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    let decoded: any;

    try {
      // Decode and validate the JWT token
      decoded = await this.jwtService.verifyAsync(token);
      request.user = decoded; // Attach user payload to request
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // If roles are required, validate that user has at least one
    if (roles && !roles.some((role) => decoded.roles?.includes(role))) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
