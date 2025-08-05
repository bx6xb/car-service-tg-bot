import { Context, TelegramError } from 'telegraf';
import { logError } from './logError';
import { ExtraEditMessageText } from 'telegraf/typings/telegram-types';

export const editMessageText = async (ctx: Context, text: string, extra?: ExtraEditMessageText) => {
  try {
    await ctx.editMessageText(text, extra);
  } catch (e: unknown) {
    const err = e as TelegramError;

    if (err.description?.includes('message is not modified')) {
      try {
        await ctx.answerCbQuery();
      } catch (cbErr) {
        logError(cbErr, 'answerCbQuery inside editMessageText');
      }
      return;
    }

    logError(err, 'EditMessageText error');
  }
};
