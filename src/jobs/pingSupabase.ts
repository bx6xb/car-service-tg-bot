import { logError, notifyAdmins } from '../lib';
import { HealthService } from '../services';

export const pingSupabase = async () => {
  try {
    await HealthService.ping();
    console.log('[pingSupabase] TG Supabase OK');
  } catch (err) {
    logError(err, 'pingSupabase');
    await notifyAdmins(`❌ Supabase ping failed: ${String(err)}`);
  }
};
