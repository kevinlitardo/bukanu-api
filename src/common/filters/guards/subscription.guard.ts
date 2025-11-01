import { User } from '@clerk/express';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import hasActiveSubscriptionUseCase from 'src/subscription/use-cases/has-active-subscription.use-case';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user; // usuario de Clerk previamente verificado en AuthGuard

    await hasActiveSubscriptionUseCase(this.prisma, user.id);

    return true;
  }
}
