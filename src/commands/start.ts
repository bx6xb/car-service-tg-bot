import { UserApi } from '../api';
import { bot } from '../config';
import { logError } from '../lib';

bot.start(async (ctx) => {
  await ctx.reply('Привет! Этот');

  const { id, username } = ctx.from;

  try {
    await UserApi.addUser(id, username);
  } catch (e) {
    logError(e, 'Failed to add user');
  }
});
