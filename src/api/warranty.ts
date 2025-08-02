import { db } from './db';
import { Warranty } from './types';

export class WarrantyApi {
  static getAllWarranties = async (): Promise<Warranty[]> => {
    const warranties = await db.query(`SELECT * FROM warranty_reminders`);

    return warranties.rows;
  };

  static getUserWarranties = async (userId: number): Promise<Warranty[]> => {
    const warranties = await db.query(`SELECT * FROM warranty_reminders WHERE user_id = $1`, [
      userId,
    ]);

    return warranties.rows;
  };

  static getUserStartDate = async (
    id: number,
    userId: number,
  ): Promise<{ start_date: number } | undefined> => {
    const dates = await db.query(
      `SELECT start_date FROM warranty_reminders WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );

    return dates.rows[0];
  };

  static createWarranty = async (
    userId: number,
    batteryName: string,
    duration: number,
  ): Promise<void> => {
    const startDate = new Date().setHours(0, 0, 0, 0);
    const createdAt = Date.now();

    await db.query(
      `INSERT INTO warranty_reminders (user_id, battery_name, start_date, duration_months, created_at) VALUES ($1, $2, $3, $4, $5)`,
      [userId, batteryName, startDate, duration, createdAt],
    );
  };

  static pauseWarranty = async (nextTODate: number, id: number, userId: number): Promise<void> => {
    await db.query(
      `UPDATE warranty_reminders SET notifications_paused_until = $1 WHERE id = $2 AND user_id = $3`,
      [nextTODate, id, userId],
    );
  };

  static enableWarranty = async (id: number, userId: number): Promise<void> => {
    await db.query(
      `UPDATE warranty_reminders SET notifications_paused_until = NULL WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );
  };

  static removeWarranty = async (id: number): Promise<void> => {
    await db.query(`DELETE FROM warranty_reminders WHERE id = $1`, [id]);
  };
}

WarrantyApi.getAllWarranties().then((res) => console.log(res));
