import { Context, MiddlewareFn } from 'telegraf';
import { ADMIN_IDS } from '../config';

export const adminMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
  const userId = ctx.from?.id;

  if (!userId || !ADMIN_IDS.includes(userId)) return;

  await next();
};
