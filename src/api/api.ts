import { db } from './db';
import { PublicNotificationResponse, UserNotificationResponse, UsersResponse } from './types';

export class Api {
  static fetchUsers = async (): Promise<UsersResponse> =>
    (await db.query('SELECT * FROM users')).rows as UsersResponse;

  static fetchUserNotifications = async (): Promise<UserNotificationResponse[]> =>
    (await db.query('SELECT * FROM user_notifications')).rows as UserNotificationResponse[];

  static fetchPublicNotifications = async (): Promise<PublicNotificationResponse[]> =>
    (await db.query('SELECT * FROM public_notifications')).rows as PublicNotificationResponse[];

  static addNewUser = async (userId: number) =>
    await db.query('INSERT INTO users (user_id) VALUES ($1)', [userId]);

  static addUserUTC = async (userId: number, utc: number) =>
    await db.query('UPDATE users SET utc = $1 WHERE user_id = $2', [utc, userId]);

  static addPublicNotification = async (
    message: string,
    timestamp: number,
  ): Promise<PublicNotificationResponse> => {
    const result = await db.query(
      `
    INSERT INTO public_notifications (message, timestamp)
    VALUES ($1, $2)
    RETURNING *
    `,
      [message, timestamp],
    );

    return result.rows[0];
  };

  static removePublicNotification = async (notifId: string) =>
    await db.query(`DELETE FROM public_notifications WHERE id = $1`, [notifId]);

  static addUserNotification = async (
    userId: number,
    message: string,
    timestamp: number,
  ): Promise<UserNotificationResponse> => {
    const result = await db.query(
      `INSERT INTO user_notifications (user_id, message, timestamp)
     VALUES ($1, $2, $3)
     RETURNING *;`,
      [userId, message, timestamp],
    );

    return result.rows[0];
  };

  static removeUserNotification = async (notifId: string) =>
    await db.query(`DELETE FROM user_notifications WHERE id = $1`, [notifId]);
}
