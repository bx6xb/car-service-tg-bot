import { BroadcastApi, MessagesApi, UserApi } from '../api';
import { bot } from '../config';
import { escapeMarkdownV2, logError, notifyAdmins } from '../lib';

export const sendBroadcasts = async () => {
  const users = await UserApi.fetchUsers();
  const broadcasts = await BroadcastApi.getBroadcasts();

  for (const b of broadcasts) {
    if (b.scheduled_at - 1000 <= new Date().getTime()) {
      try {
        await BroadcastApi.removeBroadcast(b.id);
      } catch (e) {
        logError(e, 'Failed to remove broadcast');
        notifyAdmins('❌ Не удалось удалить рассылку из базы данных');
      }

      const usersWithoutBroadcast: (string | number)[] = [];

      for (const user of users) {
        const { username, user_id: id } = user;

        let messageId: number | null = null;

        try {
          const { message_id } = await bot.telegram.sendMessage(id, escapeMarkdownV2(b.message), {
            parse_mode: 'MarkdownV2',
            disable_notification: true,
          });

          messageId = message_id;
        } catch (e) {
          usersWithoutBroadcast.push(username ?? id);
          logError(e, 'Failed to send broadcast', { ...(username && { username }), userId: id });
        }

        if (messageId === null) continue;

        try {
          await MessagesApi.createMessage(messageId, id);
        } catch (e) {
          logError(e, 'Failed to create message', { messageId, userId: id });
        }
      }

      if (usersWithoutBroadcast.length > 0) {
        const usersText = usersWithoutBroadcast
          .map((user) => (typeof user === 'string' ? `@${user}` : `id ${user}`))
          .join('\n');

        notifyAdmins(`❌ Не удалось отправить рассылку следующим пользователям\n${usersText}`);
      }
    }
  }
};
