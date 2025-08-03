import { UserApi } from '../api';
import { bot } from '../config';
import { logError } from '../lib';

bot.start(async (ctx) => {
  await ctx.reply('Привет! Этот');

  if (!ctx.chat) return;

  try {
    await UserApi.addUser(ctx.chat.id);
  } catch (e) {
    logError(e, 'Failed to add user');
  }
});
