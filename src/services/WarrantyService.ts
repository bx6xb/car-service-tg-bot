import { WarrantyApi } from '../api';
import type { Warranty } from '../api';
import { logError } from '../lib/logError';
import { msDays } from '../lib/msDays';

export type WarrantyReminder = {
  userId: number;
  batteryName: string;
  type: 'expired' | '10days' | '20days';
};

export class WarrantyService {
  static async create(userId: number, batteryName: string, duration: number) {
    const startDate = new Date().setHours(0, 0, 0, 0);
    await WarrantyApi.createWarranty({ userId, batteryName, duration, startDate });
    return {
      startDate,
      nextServiceDate: startDate + msDays(90),
      batteryName,
      duration,
    };
  }

  static async getByUser(userId: number) {
    return WarrantyApi.getUserWarranties(userId);
  }

  static getNextTODates(warranties: Warranty[]) {
    const now = Date.now();
    const results: { batteryName: string; nextTO: number }[] = [];

    for (const w of warranties) {
      const { battery_name, start_date, duration_months } = w;
      const endDate = start_date + duration_months * msDays(30);
      if (now > endDate) continue;

      const monthsPassed = Math.floor((now - start_date) / msDays(90));
      const nextTO = start_date + (monthsPassed + 1) * msDays(90);
      results.push({ batteryName: battery_name, nextTO });
    }

    return results;
  }

  static async pause(warrantyId: number, userId: number) {
    const date = await WarrantyApi.getUserStartDate(warrantyId, userId);
    if (!date) return null;

    const startDate = date.start_date;
    const now = Date.now();
    const MS_IN_90_DAYS = msDays(90);
    const intervalsPassed = Math.floor((now - startDate) / MS_IN_90_DAYS);
    const nextTODate = startDate + (intervalsPassed + 1) * MS_IN_90_DAYS;

    await WarrantyApi.pauseWarranty(nextTODate, warrantyId, userId);
    return { nextTODate };
  }

  static async disable(warrantyId: number): Promise<void> {
    await WarrantyApi.removeWarranty(warrantyId);
  }

  static async getReminders(): Promise<WarrantyReminder[]> {
    const now = new Date().setHours(0, 0, 0, 0);
    const warranties = await WarrantyApi.getAllWarranties();
    const reminders: WarrantyReminder[] = [];

    for (const w of warranties) {
      const { id, user_id, battery_name, start_date, duration_months, notifications_paused_until } =
        w;

      if (notifications_paused_until && now < notifications_paused_until) continue;

      if (notifications_paused_until && now >= notifications_paused_until) {
        try {
          await WarrantyApi.enableWarranty(id, user_id);
        } catch (e) {
          logError(e, 'Failed to enable warranty notification');
        }
        continue;
      }

      const totalDuration = duration_months * msDays(30);

      if (now >= start_date + totalDuration) {
        try {
          await WarrantyApi.removeWarranty(id);
          reminders.push({ userId: user_id, batteryName: battery_name, type: 'expired' });
        } catch (e) {
          logError(e, 'Failed to remove expired warranty');
        }
        continue;
      }

      const monthsPassed = Math.floor((now - start_date) / msDays(90));
      const nextTO = start_date + (monthsPassed + 1) * msDays(90);

      if (nextTO - msDays(10) === now) {
        reminders.push({ userId: user_id, batteryName: battery_name, type: '10days' });
        continue;
      }

      if (nextTO - msDays(20) === now) {
        reminders.push({ userId: user_id, batteryName: battery_name, type: '20days' });
      }
    }

    return reminders;
  }
}
