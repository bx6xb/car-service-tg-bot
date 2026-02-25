import { MAX_ADMIN_IDS, bot } from '../config';

export const notifyAdmins = (text: string): void => {
  for (const admin of MAX_ADMIN_IDS) {
    bot.api
      .sendMessageToUser(admin, text, { format: 'html' })
      .catch((err) => {
        console.error(`Ошибка при отправке админу ${admin}:`, err);
      });
  }
};
