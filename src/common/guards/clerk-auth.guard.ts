import { clerkClient, verifyToken } from '@clerk/express';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest();

    const token = request.cookies.__session;

    if (!token) return false;

    try {
      const response = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      request.user = await clerkClient.users.getUser(response.sub);

      return true;
    } catch (error) {
      return false;
    }
  }
}
