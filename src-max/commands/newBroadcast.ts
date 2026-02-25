import { bot } from '../config';
import { adminMiddleware } from '../middlewares';
import { getUserId } from '../lib';
import { newBroadcastSteps, textState } from './state';

bot.command('nb', adminMiddleware, async (ctx) => {
  const userId = getUserId(ctx);
  if (!userId) return;

  textState.set(userId, 'new_broadcast');
  newBroadcastSteps.set(userId, { step: 'message' });
  await ctx.reply('Введите текст рассылки');
});
