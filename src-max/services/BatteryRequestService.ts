import { tgSupabase as supabase } from '../config';
import { RequestApi, Request, RequestData } from '../api';
import { getDeliveryText, getEngineText, getSource } from '../lib/request';

export class BatteryRequestService {
  static async create(data: RequestData): Promise<Request | string> {
    return RequestApi.createRequest(data);
  }

  static async getById(requestId: number) {
    const { data, error } = await supabase
      .from('battery_requests')
      .select('*')
      .eq('id', requestId)
      .single<Request>();

    return { data, error };
  }

  static async complete(
    requestId: number,
    phone: string,
    selectedBattery: string,
    address?: string,
  ) {
    const { data, error } = await supabase
      .from('battery_requests')
      .update({
        phone,
        selected_battery: selectedBattery.split('\n\n').slice(0, 2).join('\n\n'),
        ...(address && { address }),
      })
      .eq('id', requestId)
      .select()
      .single<Request>();

    return { data, error };
  }

  static buildNotificationText(request: Request): string {
    return `<b>Новая заявка #${request.id}</b>\nМарка авто: ${request.car_brand}\nМодель авто: ${request.car_model}\nТип двигателя: ${getEngineText(request.engine_type)}\nГод выпуска: ${request.production_year}\nСпособ получения: ${getDeliveryText(request.delivery_method)}${request.phone ? `\nТелефон: ${request.phone}` : ''}\nОткуда: ${getSource(request.source)}`;
  }
}
