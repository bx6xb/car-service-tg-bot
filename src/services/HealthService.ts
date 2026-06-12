import { supabase } from '../config';

export class HealthService {
  static async ping(): Promise<void> {
    const { error } = await supabase.from('users').select('user_id', { count: 'exact', head: true });

    if (error) {
      throw new Error(`TG Supabase ping failed: ${error.message}`);
    }
  }
}
