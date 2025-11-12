import { Context } from 'telegraf';
import { mainMenu } from '../buttons';
import { pinMessage } from './pinMessage';

export const showStart = (ctx: Context) => {
  setTimeout(async () => {
    const { message_id } = await ctx.reply('📋 Главное меню:', mainMenu());
    await pinMessage(ctx, message_id);
  }, 1000);
};
