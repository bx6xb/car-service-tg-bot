import { supabase } from '../config';
import { Message } from './types';

export class MessagesApi {
  static getMessages = async (): Promise<Message[]> => {
    const { data, error } = await supabase
      .from('bot_messages')
      .select('id, message_id, chat_id, created_at')
      .order('created_at', { ascending: true })
      .returns<Message[]>();

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    return data || [];
  };

  static createMessage = async (messageId: number, chatId: number): Promise<void> => {
    const createdAt = new Date().getTime();

    const { error } = await supabase
      .from('bot_messages')
      .insert([{ message_id: messageId, chat_id: chatId, created_at: createdAt }]);

    if (error) {
      throw new Error(`Failed to create message: ${error.message}`);
    }
  };

  static deleteMessage = async (id: number): Promise<void> => {
    const { error } = await supabase.from('bot_messages').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  };
}
