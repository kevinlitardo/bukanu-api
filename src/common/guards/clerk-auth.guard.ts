import { clerkClient, verifyToken } from '@clerk/express';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest();

    const token = request.cookies.__session;

    if (!token) {
      throw new UnauthorizedException({
        message:
          'No estás autorizado para acceder a este recurso. Por favor, verifica tus credenciales',
      });
    }

    try {
      const response = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      request.user = await clerkClient.users.getUser(response.sub);

      return true;
    } catch (error) {
      throw new UnauthorizedException({
        message:
          'No estás autorizado para acceder a este recurso. Por favor, verifica tus credenciales',
      });
    }
  }
}
