import { bot } from '../config';
import { addType, logError } from '../lib';
import { Api } from './api';
import { AppState, UserNotification } from './types';

export const APP_STATE: AppState = {
  users: [],
  notifications: [],
};

(async () => {
  try {
    const [users, publicNotifications, userNotifications] = await Promise.all([
      Api.fetchUsers(),
      Api.fetchPublicNotifications(),
      Api.fetchUserNotifications(),
    ]);

    APP_STATE.users = users;
    APP_STATE.notifications = [
      ...publicNotifications.map(addType),
      ...userNotifications.map(addType),
    ];

    // interval to check notifications
    setInterval(async () => {
      const filteredNotifications = APP_STATE.notifications.filter(
        (notif) => notif.timestamp < new Date().getTime(),
      );

      for (const notif of filteredNotifications) {
        try {
          if (notif.type === 'user') {
            const userNotif = notif as UserNotification;

            bot.telegram.sendMessage(userNotif.user_id, userNotif.message);

            await Api.removeUserNotification(userNotif.id);
          } else {
            for (let i = 0; i < APP_STATE.users.length; i++) {
              bot.telegram.sendMessage(APP_STATE.users[i], notif.message);
            }

            await Api.removePublicNotification(notif.id);
          }
        } catch (e) {
          logError(e, `Failed to delete ${notif.type} notification`, {
            userNotificationId: notif.id,
          });
        }

        APP_STATE.notifications = APP_STATE.notifications.filter((notif) => notif.id !== notif.id);
      }
    }, 3 * 1000);
  } catch (e) {
    logError(e, 'Failed to fetch data');
  }
})();
