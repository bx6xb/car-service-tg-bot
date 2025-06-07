import { Api } from './api';
import { PublicNotification, UserNotification } from './types';

export const NOTIFICATIONS_QUEUE: Record<number, number[]> = {};

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
  } catch (err) {
    console.log(err);
    console.log('-'.repeat(100));

    throw new Error('Failed to fetch data');
  }

  console.log(USERS);
  console.log(USER_NOTIFICATIONS);
  console.log(PUBLIC_NOTIFICATIONS);
})();
