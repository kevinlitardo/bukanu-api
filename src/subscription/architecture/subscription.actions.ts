export abstract class SubscriptionActions {
  abstract getUserSubscription(userId: string): Promise<any>;
  abstract hasActiveSubscription(userId: string): Promise<any>;
}
