import { bot } from '../config';
import { logError } from '../lib';
import { adminMiddleware } from '../middlewares';
import { UserService } from '../services';

bot.command('u', adminMiddleware, async (ctx) => {
  try {
    const users = await UserService.getAll();
    const msg = await ctx.reply(`👤 ${users.length}`);

    setTimeout(() => {
      if (ctx.messageId) ctx.deleteMessage(ctx.messageId).catch(() => {});
      ctx.deleteMessage(msg.body.mid).catch(() => {});
    }, 3000);
  } catch (e) {
    logError(e, 'Failed to fetch users for /users');
    await ctx.reply('❌ Не удалось загрузить пользователей');
  }
});
