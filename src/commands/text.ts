import { Markup } from 'telegraf';
import { bot } from '../config';
import { adminMiddleware } from '../middlewares';
import { broadcastsSteps, newBroadcastSteps, textState } from './state';
import { BroadcastAPI } from '../api';
import { logError } from '../lib';

bot.on('text', adminMiddleware, async (ctx) => {
  const userId = ctx.from?.id;
  const userState = textState.get(userId);

  if (userState === 'new_broadcast') {
    const userStep = newBroadcastSteps.get(userId);
    const text = ctx.message.text;

    if (userStep?.step === 'message') {
      newBroadcastSteps.set(userId, {
        step: 'date',
        messageText: text,
      });

      await ctx.reply('Напишите время рассылки в формате ДД.ММ.ГГГГ');
      return;
    }

    if (userStep?.step === 'date') {
      const match = text.match(/^(\d{1,2})\.(\d{1,2}).(\d{4})$/);
      if (!match) {
        await ctx.reply('❌ Введите корректную дату в формате ДД.ММ.ГГГГ');
        return;
      }

      const messageText = newBroadcastSteps.get(userId)?.messageText;

      newBroadcastSteps.set(userId, {
        step: 'time',
        date: text,
        messageText,
      });

      await ctx.reply(
        'Выберите время рассылки:',
        Markup.keyboard([['09:00'], ['17:00']])
          .oneTime()
          .resize(),
      );
      return;
    }

    if (userStep?.step === 'time') {
      if (text !== '09:00' && text !== '17:00') {
        await ctx.reply('❌ Выберите только 09:00 или 17:00');
        return;
      }

      const date = userStep.date;
      if (!date || !userStep.messageText) return;

      const [day, month, year] = date.split('.');
      const [hours] = text.split(':');

      const isoString = `${year}-${month}-${day}T${hours}:00:00`;
      const timestamp = new Date(isoString).getTime();

      try {
        await BroadcastAPI.createBroadcast(userStep.messageText, timestamp);
      } catch (e) {
        logError(e, 'Failed to add new broadcast');
        return await ctx.reply('❌ Произошла ошибка при создании рассылки');
      }

      await ctx.reply(`Рассылка запланирована на ${text} по МСК`, Markup.removeKeyboard());

      textState.delete(userId);
      newBroadcastSteps.delete(userId);
      return;
    }

    return;
  }

  if (userState === 'broadcasts') {
    const userId = ctx.from?.id;

    if (!broadcastsSteps.has(userId)) return;

    const broadcastNumber = ctx.message.text;
    const broadcasts = broadcastsSteps.get(userId);

    if (!broadcasts) return;

    if (!(broadcastNumber in broadcasts)) {
      await ctx.reply('❌ Рассылки с таким номером нет, введите корректный номер');
      return;
    }

    try {
      await BroadcastAPI.removeBroadcast(broadcasts[broadcastNumber]);

      textState.delete(userId);
      broadcastsSteps.delete(userId);
      await ctx.reply('Рассылка успешно удалена');
    } catch (e) {
      logError(e, 'Failed to remove broadcast');
      return await ctx.reply('❌ Произошла ошибка при удалении рассылки, введите номер ещё раз');
    }
  }
});
