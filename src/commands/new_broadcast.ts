import { Markup } from 'telegraf';
import { ADMIN_IDS, bot } from '../config';
import { BroadcastAPI } from '../api';
import { logError } from '../lib';

type Step = 'message' | 'date' | 'time';
type UserStep = {
  step: Step;
  messageText?: string;
  date?: string;
};

const userSteps = new Map<number, UserStep>();

bot.command('new_broadcast', async (ctx) => {
  const userId = ctx.from?.id;

  if (!userId || !ADMIN_IDS.includes(userId)) return;

  userSteps.set(userId, { step: 'message' });
  await ctx.reply('Введите текст рассылки', Markup.removeKeyboard());
});

bot.on('text', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId || !ADMIN_IDS.includes(userId)) return;

  const userStep = userSteps.get(userId);
  const text = ctx.message.text;

  if (userStep?.step === 'message') {
    userSteps.set(userId, {
      step: 'date',
      messageText: text,
    });

    await ctx.reply('Напишите время рассылки в формате ДД.ММ.ГГГГ');
    return;
  }

  if (userStep?.step === 'date') {
    const match = text.match(/^(\d{1,2})\.(\d{1,2}).(\d{4})$/);
    if (!match) {
      await ctx.reply('Введите корректную дату в формате ДД.ММ.ГГГГ');
      return;
    }

    const messageText = userSteps.get(userId)?.messageText;

    userSteps.set(userId, {
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
      await ctx.reply('Выберите только 09:00 или 17:00');
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
    }

    await ctx.reply(`Рассылка запланирована на ${text} по МСК`, Markup.removeKeyboard());

    userSteps.delete(userId);
    return;
  }
});
