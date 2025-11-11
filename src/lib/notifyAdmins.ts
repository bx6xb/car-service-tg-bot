import { ADMIN_IDS, bot } from '../config';
import { escapeMarkdownV2 } from './escapeMarkdownV2';

export const notifyAdmins = (text: string): void => {
  for (const admin of ADMIN_IDS) {
    bot.telegram.sendMessage(admin, escapeMarkdownV2(text), { parse_mode: 'MarkdownV2' });
  }
};
