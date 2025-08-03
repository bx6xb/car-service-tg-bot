// commands/index.ts
import { Telegraf } from 'telegraf';
import * as start from './start';
import * as help from './help';
import { setupButtonHandlers } from './list';

// Экспортируем обработчики для использования где-то ещё (если нужно)
export { start } from './start';
export { help } from './help';
export { setupButtonHandlers } from './list';

// Регистрируем все команды и кнопки
export const registerCommands = (bot: Telegraf) => {
  bot.start(start.start);
  bot.help(help.help);
  setupButtonHandlers(bot);
};
