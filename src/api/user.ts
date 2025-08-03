import { db } from './db';
import { User } from './types';

export class UserApi {
  static fetchUsers = async (): Promise<User[]> =>
    (await db.query('SELECT * FROM users')).rows as User[];

  static addUser = async (userId: number, username?: string): Promise<void> => {
    await db.query(
      `
    INSERT INTO users (user_id, username)
    VALUES ($1, $2)
    ON CONFLICT (user_id) DO UPDATE SET username = EXCLUDED.username
    `,
      [userId, username ?? null],
    );
  };
}
