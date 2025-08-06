import { MessagesApi } from '../api';
import { bot } from '../config';
import { logError } from './logError';
import { msDays } from './msDays';
import { notifyAdmins } from './notifyAdmins';

export const cleanupOldMessages = async () => {
  try {
    const messages = await MessagesApi.getMessages();

    const filteredMessages = messages.filter(
      (m) => m.created_at + msDays(1) - 1000 <= new Date().getTime(),
    );

    const notDeletedMessages: number[] = [];

    for (const m of filteredMessages) {
      try {
        await bot.telegram.deleteMessage(m.chat_id, m.message_id);
        await MessagesApi.deleteMessage(m.id);
      } catch (e) {
        notDeletedMessages.push(m.id);
        logError(e, 'Failed to remove bot message', m);
      }
    }

    if (notDeletedMessages.length > 0) {
      notifyAdmins(`❌ Не удалось удалить следующие сообщения\n${notDeletedMessages.join('\n')}`);
    }
  } catch (e) {
    logError(e, 'Failed to get messages');
    notifyAdmins('❌ Не удалось получить сообщения для их удаления');
  }
};
