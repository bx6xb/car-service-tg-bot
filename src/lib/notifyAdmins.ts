import { ADMIN_IDS, bot } from '../config';

export const notifyAdmins = (text: string): void => {
  for (const admin of ADMIN_IDS) {
    bot.telegram.sendMessage(admin, text);
  }
};
