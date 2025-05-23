import { Telegraf } from 'telegraf';
import { config } from 'dotenv';

config();

const TOKEN = process.env.TOKEN;

if (!TOKEN) throw new Error('No bot token found');

const bot = new Telegraf(TOKEN);

bot.start((ctx) => ctx.reply('Привет!'));
bot.command('help', (ctx) => ctx.reply('Чем могу помочь?'));

bot.launch();
