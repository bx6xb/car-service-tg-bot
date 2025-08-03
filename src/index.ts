import { Telegraf } from 'telegraf';
import { BOT_TOKEN } from './config';
import { setupButtonHandlers } from './commands/list';
import { start } from './commands/start';
import { help } from './commands/help';

const bot = new Telegraf(BOT_TOKEN as string);

bot.start(start);
bot.help(help);

setupButtonHandlers(bot);

bot.launch();
