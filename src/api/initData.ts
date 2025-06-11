import { bot } from '../config';
import { addType } from '../lib';
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

    console.log(users);

    APP_STATE.users = users;
    APP_STATE.notifications = [
      ...publicNotifications.map(addType),
      ...userNotifications.map(addType),
    ];

    // interval to check notifications
    setInterval(async () => {
      const now = new Date().getTime();

      const filteredNotifications = APP_STATE.notifications.filter(
        (notif) => notif.timestamp < now,
      );

      for (const notif of filteredNotifications) {
        if (notif.type === 'user') {
          const userNotif = notif as UserNotification;
          bot.telegram.sendMessage(userNotif.user_id, userNotif.message);

          try {
            await Api.removeUserNotification(userNotif.id);

            APP_STATE.notifications = APP_STATE.notifications.filter(
              (notif) => notif.id !== userNotif.id,
            );
          } catch {
            console.log('Failed to delete user notification', userNotif.id);
          }
        } else {
          for (let i = 0; i < APP_STATE.users.length; i++) {
            bot.telegram.sendMessage(APP_STATE.users[i], notif.message);
          }

          try {
            await Api.removePublicNotification(notif.id);

            APP_STATE.notifications = APP_STATE.notifications.filter(
              (notif) => notif.id !== notif.id,
            );
          } catch {
            console.log('Failed to delete public notification', notif.id);
          }
        }
      }
    }, 3 * 1000);
  } catch (err) {
    console.log(err);
    console.log('-'.repeat(100));
    throw new Error('Failed to fetch data');
  }
})();
