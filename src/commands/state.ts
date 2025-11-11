import { RequestData } from '../api';

export const textState = new Map<number, 'broadcasts' | 'new_broadcast' | 'battery_request'>();

export const newBroadcastSteps = new Map<
  number,
  {
    step: 'message' | 'date' | 'time';
    messageText?: string;
    date?: string;
  }
>();

export const broadcastsSteps = new Map<number, Record<string, number>>();

export const requestSteps = new Map<
  number,
  {
    step: 'car_brand' | 'car_model' | 'engine_type' | 'production_year' | 'delivery_method';
  } & Partial<RequestData>
>();
