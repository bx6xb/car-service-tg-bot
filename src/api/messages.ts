import { db } from './db';
import { Message } from './types';

export class MessagesApi {
  static getMessages = async (): Promise<Message[]> => {
    const res = await db.query(`
      SELECT id, message_id, chat_id, created_at FROM bot_messages;
    `);

    return res.rows;
  };

  static createMessage = async (messageId: number, chatId: number): Promise<void> => {
    const createdAt = new Date().getTime();

    await db.query(
      'INSERT INTO bot_messages (message_id, chat_id, created_at) VALUES ($1, $2, $3)',
      [messageId, chatId, createdAt],
    );
  };

  static deleteMessage = async (id: number): Promise<void> => {
    await db.query('DELETE FROM bot_messages WHERE id = $1', [id]);
  };
}
