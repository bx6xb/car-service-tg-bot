import { Keyboard } from '@maxhub/max-bot-api';

export const goBackMenu = (payload: string) =>
  Keyboard.inlineKeyboard([[Keyboard.button.callback('↩️ Назад', payload)]]);
