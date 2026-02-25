import { Bot } from '@maxhub/max-bot-api';
import { MAX_BOT_TOKEN } from './variables';
import { logError, notifyAdmins } from '../lib';

export const bot = new Bot(MAX_BOT_TOKEN as string);

bot.api.setMyCommands([{ name: 'menu', description: '📋 Главное меню' }]);

bot.catch((err) => {
  logError(err, 'Bot error');
  notifyAdmins(`❌ ОШИБКА БОТА ❌\n${String(err)}`);
});

bot.start();
