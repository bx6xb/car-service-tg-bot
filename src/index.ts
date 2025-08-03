import { Telegraf } from 'telegraf';
import { BOT_TOKEN } from './config';
import { start } from './commands';

export const bot = new Telegraf(BOT_TOKEN as string);

bot.start(start);

bot.launch();
