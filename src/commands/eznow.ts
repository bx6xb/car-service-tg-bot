import { BroadcastAPI } from '../api';
import { ADMIN_IDS, bot } from '../config';
import { formatDate, logError } from '../lib';

const userSteps = new Map<number, Record<string, number>>();

bot.command('broadcasts', async (ctx) => {
  const userId = ctx.from?.id;

  if (!userId || !ADMIN_IDS.includes(userId)) return;

  try {
    const broadcasts = await BroadcastAPI.getBroadcasts();

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

    userSteps.set(userId, obj);

    await ctx.reply(`${string}Напишите номер рассылки для удаления`);
  } catch (e) {
    await ctx.reply('Произошла ошибка при загружке данных');
    logError(e, 'Failed to get broadcasts');
  }
});

bot.on('text', async (ctx) => {
  const userId = ctx.from?.id;

  if (!userId || !ADMIN_IDS.includes(userId) || !userSteps.has(userId)) return;

  const broadcastNumber = ctx.message.text;
  const broadcasts = userSteps.get(userId);

  if (!broadcasts) return;

  if (!(broadcastNumber in broadcasts)) {
    await ctx.reply('Рассылки с таким номером нет, введите корректный номер');
    return;
  }

  try {
    await BroadcastAPI.removeBroadcast(broadcasts[broadcastNumber]);

    userSteps.delete(userId);
    await ctx.reply('Рассылка успешно удалена');
  } catch (e) {
    await ctx.reply('Произошла ошибка при удалении рассылки, введите номер ещё раз');
    logError(e, 'Failed to remove broadcast');
  }
});
