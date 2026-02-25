import { Context } from '@maxhub/max-bot-api';
import { mainMenu } from '../buttons';
import { pinMessage } from './pinMessage';

export const showStart = (ctx: Context) => {
  setTimeout(async () => {
    const msg = await ctx.reply('📋 Главное меню:', { attachments: [mainMenu()] });
    await pinMessage(ctx, msg.body.mid);
  }, 1000);
};
