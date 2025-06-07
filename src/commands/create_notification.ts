import { Context } from 'telegraf';
import { Api } from '../api';
import { createUserNotification } from '../lib';

export const createNotification = async (ctx: Context) => {
  if (!ctx.message || !('text' in ctx.message)) return;

  const splittedText = ctx.message.text.split(' ');

  if (splittedText.length !== 3 || !ctx.chat) return;

  const message = splittedText[1];
  const timestampString = splittedText[2];

  const timestamp = new Date(timestampString).getTime();

  try {
    await Api.addUserNotification(ctx.chat!.id, message, timestamp);

    createUserNotification(ctx.chat.id, message, timestamp);
  } catch {
    console.log('Failed to create notification', ctx.chat!.id, message, timestamp);
    ctx.reply('Не получилось создать уведомление, обратитесь в поддержку');
  }
};
