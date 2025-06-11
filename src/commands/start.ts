import { Api, APP_STATE } from '../api';
import { bot } from '../config';
import { logError } from '../lib';

bot.start(async (ctx) => {
  ctx.reply('Привет!');

  if (!ctx.chat) return;

  const userId = ctx.chat.id;

  if (!APP_STATE.users.includes(userId)) {
    try {
      await Api.addNewUser(userId);
    } catch (e) {
      logError(e, 'Failed to add user', { userId });
    }

    APP_STATE.users.push(userId);
  }
});
