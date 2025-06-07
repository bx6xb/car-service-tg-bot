import { bot } from '..';
import { Api, NOTIFICATIONS_QUEUE } from '../api';

export const createUserNotification = (
  userId: number,
  message: string,
  timestamp: number,
): void => {
  const time = timestamp - new Date().getTime();

  if (time < 0) return;

  const timeoutId = +setTimeout(async () => {
    bot.telegram.sendMessage(userId, message);

    try {
      await Api.removeUserNotification(userId);

      NOTIFICATIONS_QUEUE[userId] = NOTIFICATIONS_QUEUE[userId].filter((id) => id !== timeoutId);
      console.log('delete', NOTIFICATIONS_QUEUE);
    } catch {
      console.log('Failed to remove user notification');
    }
  }, time);

  if (NOTIFICATIONS_QUEUE[userId]) {
    NOTIFICATIONS_QUEUE[userId].push(timeoutId);
  } else {
    NOTIFICATIONS_QUEUE[userId] = [timeoutId];
  }

  console.log('add', NOTIFICATIONS_QUEUE);
};
