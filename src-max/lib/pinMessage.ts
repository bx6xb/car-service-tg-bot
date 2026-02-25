import { Context } from '@maxhub/max-bot-api';

export const pinMessage = async (ctx: Context, messageId: string): Promise<void> => {
  try {
    await ctx.unpinMessage();
    await ctx.pinMessage(messageId, { notify: false });
  } catch {
    // ignore pin errors
  }
};
