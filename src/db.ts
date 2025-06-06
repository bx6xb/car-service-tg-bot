import { Pool } from 'pg';
import { UserNotification, PublicNotification } from './types';
import { PG_DATABASE, PG_HOST, PG_PASSWORD, PG_PORT, PG_USER } from './config';

export const db = new Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  port: +PG_PORT!,
});

// data
export let USERS: string[] = [];
export let USER_NOTIFICATIONS: UserNotification[] = [];
export let PUBLIC_NOTIFICATIONS: PublicNotification[] = [];

(async () => {
  try {
    const usersResponse = (await db.query('SELECT * FROM users')).rows as { user_id: string }[];
    USERS = usersResponse.map((user) => user.user_id);

    USER_NOTIFICATIONS = (await db.query('SELECT * FROM user_notifications'))
      .rows as UserNotification[];

    PUBLIC_NOTIFICATIONS = (await db.query('SELECT * FROM public_notifications'))
      .rows as PublicNotification[];
  } catch {
    throw new Error('Failed to fetch data');
  }

  console.log(USERS);
  console.log(USER_NOTIFICATIONS);
  console.log(PUBLIC_NOTIFICATIONS);
})();
