import 'dotenv/config';
import { Telegraf } from 'telegraf';

export const bot = new Telegraf(process.env.BOT_TOKEN as string);

bot.launch();
