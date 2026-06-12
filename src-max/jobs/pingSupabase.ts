import { logError, notifyAdmins } from '../lib';
import { HealthService } from '../services';

export const pingSupabase = async () => {
  try {
    await HealthService.ping();
    console.log('[pingSupabase] Max + TG Supabase OK');
  } catch (err) {
    logError(err, 'pingSupabase');
    notifyAdmins(`❌ Supabase ping failed: ${String(err)}`);
  }
};
