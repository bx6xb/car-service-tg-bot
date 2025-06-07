import { Context } from 'telegraf';
import { Api, USERS } from '../api';

export const start = async (ctx: Context) => {
  ctx.reply('Привет!');

  if (!ctx.chat) return;

  const userId = String(ctx.chat.id);

  if (!USERS.includes(userId)) {
    try {
      Api.addNewUser(userId);

      USERS.push(userId);
    } catch {
      console.log('Failed to add user', userId);
    }
  }
};
