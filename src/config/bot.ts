import { Telegraf } from 'telegraf';
import { BOT_TOKEN } from './variables';
import { cleanupOldMessages, logError, notifyAdmins } from '../lib';

export const bot = new Telegraf(BOT_TOKEN as string);

bot.catch((err) => {
  logError(err, 'Bot error');

  notifyAdmins(`❌ ОШИБКА БОТА ❌\n${String(err)}`);
});

bot.launch().then(() => {
  cleanupOldMessages();
});
