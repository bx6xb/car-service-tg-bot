import { db } from './db';
import { Broadcast } from './types';

export class BroadcastApi {
  static createBroadcast = async (message: string, scheduled_at: number): Promise<void> => {
    await db.query(`INSERT INTO broadcasts (message, scheduled_at) VALUES ($1, $2)`, [
      message,
      scheduled_at,
    ]);
  };

  static removeBroadcast = async (id: number): Promise<void> => {
    await db.query(`DELETE FROM broadcasts WHERE id = $1`, [id]);
  };

  static getBroadcasts = async (): Promise<Broadcast[]> => {
    const { rows } = await db.query(`SELECT * FROM broadcasts ORDER BY scheduled_at ASC`);

    return rows;
  };
}
