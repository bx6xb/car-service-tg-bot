import { db } from './db';
import { User } from './types';

export class UserApi {
  static fetchUsers = async (): Promise<User[]> =>
    (await db.query('SELECT * FROM users')).rows as User[];

  static addUser = async (userId: number): Promise<void> => {
    db.query(
      `
      INSERT INTO users (user_id)
      VALUES ($1)
      ON CONFLICT (user_id) DO NOTHING
      `,
      [userId],
    );
  };
}
