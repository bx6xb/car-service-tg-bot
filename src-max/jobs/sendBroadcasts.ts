import { MessagesApi } from '../api';
import { bot } from '../config';
import { logError, notifyAdmins } from '../lib';
import { BroadcastService, UserService } from '../services';

export const sendBroadcasts = async () => {
  const users = await UserService.getAll();
  const broadcasts = await BroadcastService.getDue();

  for (const b of broadcasts) {
    try {
      await BroadcastService.remove(b.id);
    } catch (e) {
      logError(e, 'Failed to remove broadcast');
      notifyAdmins('❌ Не удалось удалить рассылку из базы данных');
    }

    const usersWithoutBroadcast: (string | number)[] = [];

    for (const user of users) {
      const { username, user_id: id } = user;

      let mid: string | null = null;

      try {
        const message = await bot.api.sendMessageToUser(id, b.message, {
          notify: false,
        });

        mid = message.body.mid;
      } catch (e) {
        usersWithoutBroadcast.push(username ?? id);
        logError(e, 'Failed to send broadcast', { ...(username && { username }), userId: id });
      }

      if (mid === null) continue;

      try {
        await MessagesApi.createMessage(mid, id);
      } catch (e) {
        logError(e, 'Failed to create message', { userId: id });
      }
    }

    if (usersWithoutBroadcast.length > 0) {
      const usersText = usersWithoutBroadcast
        .map((user) => (typeof user === 'string' ? `@${user}` : `id ${user}`))
        .join('\n');

      notifyAdmins(`❌ Не удалось отправить рассылку следующим пользователям\n${usersText}`);
    }
  }
};
