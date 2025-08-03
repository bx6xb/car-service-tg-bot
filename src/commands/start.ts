import { UserApi } from '../api';
import { bot } from '../config';
import { logError, notifyAdmins } from '../lib';

bot.start(async (ctx) => {
  await ctx.reply('Привет! Этот');

  const { id, username } = ctx.from;

  try {
    await UserApi.addUser(id, username);
  } catch (e) {
    logError(e, 'Failed to add user');
    notifyAdmins(
      `❌ Не удалось добавить нового пользователя ${username ? `@${username} ` : ''}id ${id}`,
    );
  }
});
