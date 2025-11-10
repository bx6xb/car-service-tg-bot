import { supabase } from '../config';
import { User } from './types';

export class UserApi {
  static fetchUsers = async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*').returns<User[]>()

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data || [];
  };

  static addUser = async (userId: number, username?: string): Promise<void> => {
    const { error } = await supabase
      .from('users')
      .upsert(
        { user_id: userId, username: username ?? null },
        { onConflict: 'user_id' }
      );

    if (error) {
      throw new Error(`Failed to add/update user: ${error.message}`);
    }
  };
}
