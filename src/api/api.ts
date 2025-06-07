import { db } from './db';
import { PublicNotification, UserNotification } from './types';

export class Api {
  static fetchUsers = async (): Promise<string[]> => {
    const users = (await db.query('SELECT * FROM users')).rows as { user_id: string }[];
    return users.map((user) => user.user_id);
  };

  static fetchUserNotifications = async (): Promise<UserNotification[]> =>
    (await db.query('SELECT * FROM user_notifications')).rows as UserNotification[];

  static fetchPublicNotifications = async (): Promise<PublicNotification[]> =>
    (await db.query('SELECT * FROM public_notifications')).rows as PublicNotification[];

  static addNewUser = async (userId: string) =>
    await db.query('INSERT INTO users (user_id) VALUES ($1)', [userId]);

  static addUserNotification = async (userId: number, message: string, timestamp: number) =>
    await db.query(
      `INSERT INTO user_notifications (user_id, message, timestamp)
       VALUES ($1, $2, $3)`,
      [userId, message, timestamp],
    );

  static removeUserNotification = async (userId: number) =>
    await db.query(`DELETE FROM user_notifications WHERE user_id = $1`, [userId]);
}
