import { Api } from './api';
import { PublicNotification, UserNotification } from './types';

export let USERS: string[] = [];
export let USER_NOTIFICATIONS: UserNotification[] = [];
export let PUBLIC_NOTIFICATIONS: PublicNotification[] = [];

(async () => {
  try {
    const [users, userNotifications, publicNotifications] = await Promise.all([
      Api.fetchUsers(),
      Api.fetchUserNotifications(),
      Api.fetchPublicNotifications(),
    ]);

    USERS = users;
    USER_NOTIFICATIONS = userNotifications;
    PUBLIC_NOTIFICATIONS = publicNotifications;
  } catch {
    throw new Error('Failed to fetch data');
  }

  console.log(USERS);
  console.log(USER_NOTIFICATIONS);
  console.log(PUBLIC_NOTIFICATIONS);
})();
