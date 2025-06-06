import { Context } from 'telegraf';
import { USERS, db } from '../db';

export const start = async (ctx: Context) => {
  ctx.reply('Привет!');

  if (!ctx.chat) return;

  const userId = String(ctx.chat.id);

  if (!USERS.includes(userId)) {
    try {
      await db.query('INSERT INTO users (user_id) VALUES ($1)', [userId]);

      USERS.push(userId);
    } catch {
      console.log('Failed to add user', userId);
    }
  }
};
