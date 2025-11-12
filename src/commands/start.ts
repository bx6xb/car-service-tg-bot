import { UserApi } from '../api';
import { bot } from '../config';
import { logError, notifyAdmins, pinMessage } from '../lib';
import { mainMenu } from '../buttons';

bot.start(async (ctx) => {
  const { message_id } = await ctx.reply('📋 Главное меню:', mainMenu());

  const { id, username } = ctx.from;

  try {
    await pinMessage(ctx, message_id);
    await UserApi.addUser(id, username);
  } catch (e) {
    logError(e, 'Failed to add user');
    notifyAdmins(
      `❌ Не удалось добавить нового пользователя ${username ? `@${username} ` : ''}id ${id}`,
    );
  }
});
