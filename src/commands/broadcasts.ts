import { BroadcastApi } from '../api';
import { bot } from '../config';
import { formatDate, logError } from '../lib';
import { adminMiddleware } from '../middlewares';
import { broadcastsSteps, textState } from './state';

bot.command('b', adminMiddleware, async (ctx) => {
  try {
    const broadcasts = await BroadcastApi.getBroadcasts();

    if (broadcasts.length === 0) {
      await ctx.reply(
        'Нет существующих рассылок\nИспользуйте /new_broadcast для создания новой рассылки',
      );
      return;
    }

    const obj: Record<string, number> = {};
    let string = '';

    for (let i = 0; i < broadcasts.length; i++) {
      const b = broadcasts[i];

      obj[i + 1] = b.id;
      string += `${i + 1}. ${b.message}\n${formatDate(b.scheduled_at)}\n\n`;
    }

    const userId = ctx.from?.id;
    textState.set(userId, 'broadcasts');
    broadcastsSteps.set(userId, obj);

    await ctx.reply(`${string}Напишите номер рассылки для удаления`);
  } catch (e) {
    await ctx.reply('❌ Произошла ошибка при загружке данных');
    logError(e, 'Failed to get broadcasts');
  }
});
