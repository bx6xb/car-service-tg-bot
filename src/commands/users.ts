import { UserApi } from '../api';
import { bot } from '../config';
import { logError } from '../lib';
import { adminMiddleware } from '../middlewares';

bot.command('users', adminMiddleware, async (ctx) => {
  try {
    const users = await UserApi.fetchUsers();
    const { message_id } = await ctx.reply(`👤 ${users.length}`);

    setTimeout(() => {
      ctx.deleteMessage(ctx.message.message_id);
      ctx.deleteMessage(message_id);
    }, 3000);
  } catch (e) {
    logError(e, 'Failed to fetch users for /users');
    await ctx.reply('❌ Не удалось загрузить пользователей');
  }
});
