import { Context } from 'telegraf';
import { Api, APP_STATE } from '../api';
import { addType } from './addType';
import { ADMIN_IDS } from '../config';
import { logError } from './logError';

export const createNotification = async (
  ctx: Context,
  notificationType: 'user' | 'public',
): Promise<void> => {
  if (!ctx.message || !('text' in ctx.message)) return;

  if (notificationType === 'public' && !ADMIN_IDS.includes(ctx.chat!.id)) return;

  const splittedText = ctx.message.text.split(' ');

  if (splittedText.length < 3 || !ctx.chat) return;

  const message = splittedText.slice(1, splittedText.length - 1).join(' ');
  const timestampString = splittedText.pop() as string;

  const timestamp = new Date(timestampString).getTime();

  try {
    let response;
    if (notificationType === 'user') {
      response = await Api.addUserNotification(ctx.chat!.id, message, timestamp);
    } else {
      response = await Api.addPublicNotification(message, timestamp);
    }

    APP_STATE.notifications.push(addType(response));

    ctx.reply('Уведомление создано!');
  } catch (e) {
    logError(e, `Failed to create ${notificationType} notification`, {
      ...(notificationType === 'user' && {
        userId: ctx.chat!.id,
      }),
      message,
      timestamp,
    });
    ctx.reply('Не получилось создать уведомление, попробуйте ещё раз или обратитесь в поддержку');
  }
};
