import { MessagesApi } from '../api';
import { bot } from '../config';
import { logError } from './logError';

export const cleanupOldMessages = async () => {
  const messages = await MessagesApi.getMessages();

  for (const m of messages) {
    try {
      await bot.telegram.deleteMessage(m.chat_id, m.message_id);
      await MessagesApi.deleteMessage(m.id);
    } catch (e) {
      logError(e, 'Failed to remove bot message', m);
    }
  }
};
