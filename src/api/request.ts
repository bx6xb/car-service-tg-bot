import { supabase } from '../config';
import { Request, RequestData } from './types';

export class RequestApi {
  static createRequest = async (requestData: RequestData): Promise<Request | string> => {
    const { data } = await supabase
      .from('battery_requests')
      .insert([
        {
          ...requestData,
          source: 'tg',
        },
      ])
      .select()
      .single();

    if (data) {
      return data;
    }

    return '❌ Произошла ошибка при создании заявки';
  };
}
