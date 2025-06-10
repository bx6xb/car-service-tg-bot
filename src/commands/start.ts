import { Context } from 'telegraf';
import { Api, APP_STATE } from '../api';

export const start = async (ctx: Context) => {
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
};
