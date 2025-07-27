import { Telegraf } from 'telegraf';
import { BOT_TOKEN } from './variables';

export const bot = new Telegraf(BOT_TOKEN as string);

bot.launch();
