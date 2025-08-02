import { BroadcastAPI, UserApi } from '../api';
import { bot } from '../config';
import { logError } from '../lib';

export const sendBroadcasts = async () => {
  const users = await UserApi.fetchUsers();
  const broadcasts = await BroadcastAPI.getBroadcasts();

  for (const b of broadcasts) {
    if (b.scheduled_at - 1000 <= new Date().getTime()) {
      try {
        for (const user of users) {
          await bot.telegram.sendMessage(user.user_id, b.message, {
            disable_notification: true,
          });
        }

        await BroadcastAPI.removeBroadcast(b.id);
      } catch (e) {
        logError(e, 'Failed to send broadcasts');
      }
    }
  }
};
