import { Context } from '@maxhub/max-bot-api';

export const sendTempMessage = async ({
  ctx,
  text,
  ms = 3000,
}: {
  ctx: Context;
  text?: string;
  ms?: number;
}): Promise<void> => {
  let mid: string | null = null;

  if (text) {
    const msg = await ctx.reply(text);
    mid = msg.body.mid;
  }

  setTimeout(() => {
    const idToDelete = mid ?? ctx.messageId;
    if (idToDelete) {
      ctx.deleteMessage(idToDelete).catch(() => {});
    }
  }, ms);
};
