import { BroadcastApi } from '../api';

export class BroadcastService {
  static validateDate(dateStr: string): boolean {
    return /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.test(dateStr);
  }

  static async create(messageText: string, dateStr: string, timeStr: '09:00' | '17:00') {
    const [day, month, year] = dateStr.split('.');
    const UTCHours = timeStr === '09:00' ? '06' : '14';
    const isoString = `${year}-${month}-${day}T${UTCHours}:00:00`;
    const timestamp = new Date(isoString).getTime();

    await BroadcastApi.createBroadcast(messageText, timestamp);
    return { timestamp, timeStr };
  }

  static async remove(id: number): Promise<void> {
    await BroadcastApi.removeBroadcast(id);
  }

  static async getAll() {
    return BroadcastApi.getBroadcasts();
  }

  static async getDue() {
    const broadcasts = await BroadcastApi.getBroadcasts();
    return broadcasts.filter((b) => b.scheduled_at - 1000 <= new Date().getTime());
  }
}
