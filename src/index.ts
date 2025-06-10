import { Telegraf } from 'telegraf';
import { createPublicNotification, createUserNotification, help, start } from './commands';

export const bot = new Telegraf(process.env.BOT_TOKEN as string);

bot.start(start);
bot.command('help', help);
bot.command('create_user_notification', createUserNotification);
bot.command('create_public_notification', createPublicNotification);

bot.launch();
