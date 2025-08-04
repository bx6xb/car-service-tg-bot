import { Markup } from 'telegraf';

export const goBackMenu = (text: string) =>
  Markup.inlineKeyboard([[Markup.button.callback('↩️ Назад', text)]]);
