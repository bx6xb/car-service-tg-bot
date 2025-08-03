import { Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';

export const sendTempMessage = async ({
  ctx,
  text,
  ms = 3000,
}: {
  ctx: Context;
  text?: string;
  ms?: number;
}): Promise<void> => {
  let msg: Message.TextMessage | null = null;

  if (text) {
    msg = await ctx.reply(text);
  }

  setTimeout(() => {
    ctx.deleteMessage(msg ? msg.message_id : ctx.message?.message_id);
  }, ms);
};
