import { ADMIN_IDS, bot } from '../config';
import { escapeMarkdownV2 } from './escapeMarkdownV2';

export const notifyAdmins = (text: string): void => {
  for (const admin of ADMIN_IDS) {
    bot.telegram
      .sendMessage(admin, escapeMarkdownV2(text), { parse_mode: 'MarkdownV2' })
      .catch((err) => {
        if (err.code === 403 || err.description?.includes('bot was blocked')) {
          console.warn(`❗ Админ ${admin} заблокировал бота`);
          return;
        }

        console.error(`Ошибка при отправке админу ${admin}:`, err);
      });
  }
};
