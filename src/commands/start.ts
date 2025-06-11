import { Api, APP_STATE } from '../api';
import { bot } from '../config';

bot.start(async (ctx) => {
  ctx.reply('Привет!');

  if (!ctx.chat) return;

  const userId = ctx.chat.id;

  if (!APP_STATE.users.includes(userId)) {
    try {
      await Api.addNewUser(userId);

      APP_STATE.users.push(userId);
    } catch {
      console.log('Failed to add user', userId);
    }
  }
});
