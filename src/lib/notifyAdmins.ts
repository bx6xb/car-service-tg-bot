import { Bot } from '@maxhub/max-bot-api';
import { MAX_ADMIN_IDS, MAX_BOT_TOKEN } from '../config';

const maxBot = new Bot(MAX_BOT_TOKEN as string);

export const notifyAdmins = (text: string): void => {
  const fullText = `📨 <b>[Telegram Bot]</b>\n${text}`;
  for (const admin of MAX_ADMIN_IDS) {
    maxBot.api
      .sendMessageToUser(admin, fullText, { format: 'html' })
      .catch((err) => {
        console.error(`Ошибка при отправке админу ${admin}:`, err);
      });
  }
};
