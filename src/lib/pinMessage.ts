import { Context } from 'telegraf';

export const pinMessage = async (ctx: Context, id: number) => {
  await ctx.unpinAllChatMessages();
  await ctx.pinChatMessage(id, {
    disable_notification: true,
  });
};
