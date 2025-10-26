import { User } from '@clerk/express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user; // usuario de Clerk previamente verificado en AuthGuard

    const hasSub = await this.subscriptionService.hasActiveSubscription(
      user.id,
    );

    if (!hasSub) {
      throw new ForbiddenException({
        message:
          'Tu suscripción ha expirado o no está activa. Por favor, renueva tu suscripción para acceder a este recurso',
      });
    }

    return true;
  }
}
