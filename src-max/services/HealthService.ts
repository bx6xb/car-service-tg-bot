import { supabase, tgSupabase } from '../config';

const clients = [
  { label: 'Max', client: supabase },
  { label: 'TG', client: tgSupabase },
] as const;

export class HealthService {
  static async ping(): Promise<void> {
    for (const { label, client } of clients) {
      const { error } = await client.from('users').select('user_id', { count: 'exact', head: true });

      if (error) {
        throw new Error(`${label} Supabase ping failed: ${error.message}`);
      }
    }
  }
}
