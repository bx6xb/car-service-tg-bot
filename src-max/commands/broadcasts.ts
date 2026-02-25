import { bot } from '../config';
import { formatDate, logError, sendTempMessage, getUserId } from '../lib';
import { adminMiddleware } from '../middlewares';
import { broadcastsSteps, textState } from './state';
import { BroadcastService } from '../services';

bot.command('b', adminMiddleware, async (ctx) => {
  try {
    const broadcasts = await BroadcastService.getAll();

    if (broadcasts.length === 0) {
      sendTempMessage({ ctx });
      sendTempMessage({
        ctx,
        text: 'Нет существующих рассылок\nИспользуйте /nb для создания новой рассылки',
      });
      return;
    }

    const obj: Record<string, number> = {};
    let string = '';

    for (let i = 0; i < broadcasts.length; i++) {
      const b = broadcasts[i];
      obj[i + 1] = b.id;
      string += `${i + 1}. ${b.message}\n${formatDate(b.scheduled_at)}\n\n`;
    }

    const userId = getUserId(ctx);
    if (!userId) return;

    textState.set(userId, 'broadcasts');
    broadcastsSteps.set(userId, obj);

    sendTempMessage({ ctx });
    sendTempMessage({ ctx, text: `${string}Напишите номер рассылки для удаления` });

    setTimeout(() => {
      textState.delete(userId);
    }, 3000);
  } catch (e) {
    await ctx.reply('❌ Произошла ошибка при загружке данных');
    logError(e, 'Failed to get broadcasts');
  }
});
