import { bot } from '../config';

bot.command('help', async (ctx) => {
  await ctx.reply('Чем могу помочь?');
});
