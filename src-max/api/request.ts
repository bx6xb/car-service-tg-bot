import { tgSupabase as supabase } from '../config';
import { Request, RequestData } from './types';

export class RequestApi {
  static createRequest = async (requestData: RequestData): Promise<Request | string> => {
    const { data, error } = await supabase
      .from('battery_requests')
      .insert([{ ...requestData, source: 'max' }])
      .select()
      .single();

    console.log('RequestApi');
    console.log({ data });
    console.log({ error });

    if (data) {
      return data;
    }

    return '❌ Произошла ошибка при создании заявки';
  };
}
