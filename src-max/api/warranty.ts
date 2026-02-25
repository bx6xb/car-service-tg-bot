import { supabase } from '../config';
import { Warranty } from './types';

export class WarrantyApi {
  static getAllWarranties = async (): Promise<Warranty[]> => {
    const { data, error } = await supabase
      .from('warranty_reminders')
      .select('*')
      .returns<Warranty[]>();

    if (error) {
      throw new Error(`Failed to fetch warranties: ${error.message}`);
    }

    return data || [];
  };

  static getUserWarranties = async (userId: number): Promise<Warranty[]> => {
    const { data, error } = await supabase
      .from('warranty_reminders')
      .select('*')
      .eq('user_id', userId)
      .returns<Warranty[]>();

    if (error) {
      throw new Error(`Failed to fetch user warranties: ${error.message}`);
    }

    return data || [];
  };

  static getUserStartDate = async (
    id: number,
    userId: number,
  ): Promise<{ start_date: number } | undefined> => {
    const { data, error } = await supabase
      .from('warranty_reminders')
      .select('start_date')
      .eq('id', id)
      .eq('user_id', userId)
      .single<{ start_date: number }>();

    if (error) {
      throw new Error(`Failed to fetch warranty start date: ${error.message}`);
    }

    return data;
  };

  static createWarranty = async ({
    userId,
    batteryName,
    startDate,
    duration,
  }: {
    userId: number;
    batteryName: string;
    startDate: number;
    duration: number;
  }): Promise<void> => {
    const { error } = await supabase.from('warranty_reminders').insert([
      {
        user_id: userId,
        battery_name: batteryName,
        start_date: startDate,
        duration_months: duration,
      },
    ]);

    if (error) {
      throw new Error(`Failed to create warranty: ${error.message}`);
    }
  };

  static pauseWarranty = async (nextTODate: number, id: number, userId: number): Promise<void> => {
    const { error } = await supabase
      .from('warranty_reminders')
      .update({ notifications_paused_until: nextTODate })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to pause warranty: ${error.message}`);
    }
  };

  static enableWarranty = async (id: number, userId: number): Promise<void> => {
    const { error } = await supabase
      .from('warranty_reminders')
      .update({ notifications_paused_until: null })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to enable warranty: ${error.message}`);
    }
  };

  static removeWarranty = async (id: number): Promise<void> => {
    const { error } = await supabase.from('warranty_reminders').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to remove warranty: ${error.message}`);
    }
  };
}
