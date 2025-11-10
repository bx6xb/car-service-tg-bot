import { supabase } from '../config';
import { Broadcast } from './types';

export class BroadcastApi {
  static createBroadcast = async (message: string, scheduled_at: number): Promise<void> => {
    const { error } = await supabase.from('broadcasts').insert([{ message, scheduled_at }]);

    if (error) {
      throw new Error(`Failed to create broadcast: ${error.message}`);
    }
  };

  static removeBroadcast = async (id: number): Promise<void> => {
    const { error } = await supabase.from('broadcasts').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to remove broadcast: ${error.message}`);
    }
  };

  static getBroadcasts = async (): Promise<Broadcast[]> => {
    const { data, error } = await supabase
      .from('broadcasts')
      .select('*')
      .order('scheduled_at', { ascending: true })
      .returns<Broadcast[]>();

    if (error) {
      throw new Error(`Failed to fetch broadcasts: ${error.message}`);
    }

    return data || [];
  };
}
