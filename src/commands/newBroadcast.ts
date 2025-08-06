import { Markup } from 'telegraf';
import { bot } from '../config';
import { adminMiddleware } from '../middlewares';
import { newBroadcastSteps, textState } from './state';

bot.command('b', adminMiddleware, async (ctx) => {
  const userId = ctx.from?.id;

  textState.set(userId, 'new_broadcast');
  newBroadcastSteps.set(userId, { step: 'message' });
  await ctx.reply('Введите текст рассылки', Markup.removeKeyboard());
});
