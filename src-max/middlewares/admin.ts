import { Context, MiddlewareFn } from '@maxhub/max-bot-api';
import { MAX_ADMIN_IDS } from '../config';

export const adminMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
  const userId = ctx.user?.user_id;

  if (!userId || !MAX_ADMIN_IDS.includes(userId)) return;

  await next();
};
