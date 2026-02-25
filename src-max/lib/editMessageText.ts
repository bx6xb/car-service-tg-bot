import { Context } from '@maxhub/max-bot-api';
import { Keyboard } from '@maxhub/max-bot-api';
import { logError } from './logError';

type InlineKeyboard = ReturnType<typeof Keyboard.inlineKeyboard>;

export const editMessageText = async (
  ctx: Context,
  text: string,
  keyboard?: InlineKeyboard,
): Promise<void> => {
  try {
    await ctx.editMessage({
      text,
      attachments: keyboard ? [keyboard] : [],
    });
  } catch (e) {
    logError(e, 'editMessageText error');
  }
};
