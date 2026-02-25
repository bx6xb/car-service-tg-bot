import { bot } from '../config';
import { logError, notifyAdmins, pinMessage, getUserId, getCtxUsername } from '../lib';
import { mainMenu } from '../buttons';
import { UserService } from '../services';

bot.on('bot_started', async (ctx) => {
  const msg = await ctx.reply('📋 Главное меню:', { attachments: [mainMenu()] });

  const userId = getUserId(ctx);
  const username = getCtxUsername(ctx);

  try {
    await pinMessage(ctx, msg.body.mid);
    if (userId) await UserService.register(userId, username ?? undefined);
  } catch (e) {
    logError(e, 'Failed to add user');
    notifyAdmins(
      `❌ Не удалось добавить нового пользователя ${username ? `@${username} ` : ''}id ${userId}`,
    );
  }
});
 