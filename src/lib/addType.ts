import {
  PublicNotification,
  PublicNotificationResponse,
  UserNotification,
  UserNotificationResponse,
} from '../api';

export const addType = (
  notif: PublicNotificationResponse | UserNotificationResponse,
): PublicNotification | UserNotification => {
  if ('user_id' in notif) {
    return {
      type: 'user',
      ...notif,
    };
  } else {
    return {
      type: 'public',
      ...notif,
    };
  }
};
