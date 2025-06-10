import { Context } from 'telegraf';
import { Api, APP_STATE } from '../api';
import { addType } from '../lib';

export const createUserNotification = async (ctx: Context) => {
  console.log(1);
  if (!ctx.message || !('text' in ctx.message)) return;

  const splittedText = ctx.message.text.split(' ');

  if (splittedText.length < 3 || !ctx.chat) return;

  const message = splittedText.slice(1, splittedText.length - 1).join(' ');
  const timestampString = splittedText.pop() as string;

  const timestamp = new Date(timestampString).getTime();

  try {
    const response = await Api.addUserNotification(ctx.chat!.id, message, timestamp);

    APP_STATE.notifications.push(addType(response));

    console.log(APP_STATE.notifications);
    ctx.reply('Уведомление создано!');
  } catch {
    console.log('Failed to create user notification', ctx.chat!.id, message, timestamp);
    ctx.reply('Не получилось создать уведомление, попробуйте ещё раз или обратитесь в поддержку');
  }
};
