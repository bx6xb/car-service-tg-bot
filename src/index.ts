import { Telegraf } from 'telegraf';
import { BOT_TOKEN } from './config';
import { createNotification, help, start } from './commands';

export const bot = new Telegraf(BOT_TOKEN as string);

bot.start(start);
bot.command('help', help);
bot.command('create_notification', createNotification);

bot.launch();
