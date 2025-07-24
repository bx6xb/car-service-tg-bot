import cron from 'node-cron';
import { UserApi } from '../api';
import { logError } from '../lib';
import { bot } from '../config';
import { BroadcastAPI } from '../api/broadcast';

export const sendBroadcasts = async () => {
  const users = await UserApi.fetchUsers();
  const broadcasts = await BroadcastAPI.getBroadcasts();

  for (const b of broadcasts) {
    if (b.scheduled_at - 1000 <= new Date().getTime()) {
      try {
        for (const user of users) {
          await bot.telegram.sendMessage(user.user_id, b.message);
        }

        await BroadcastAPI.removeBroadcast(b.id);
      } catch (e) {
        logError(e, 'Failed to send broadcasts');
      }
    }
  }
};

cron.schedule('0 9 * * *', async () => {
  await sendBroadcasts();
});

cron.schedule('0 17 * * *', async () => {
  await sendBroadcasts();
});

cron.schedule('* * * * *', async () => {
  await sendBroadcasts();
});
