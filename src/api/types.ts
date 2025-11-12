export type User = {
  user_id: number;
  username: string | null;
};

export type Broadcast = {
  id: number;
  message: string;
  scheduled_at: number;
};

export type Warranty = {
  id: number;
  user_id: number;
  battery_name: string;
  start_date: number;
  duration_months: number;
  notifications_paused_until: number | null;
};

export type Message = {
  id: number;
  message_id: number;
  chat_id: number;
  created_at: number;
};

export type RequestData = {
  car_brand: string;
  car_model: string;
  engine_type: 'petrol' | 'diesel';
  production_year: number;
  delivery_method: 'delivery' | 'pickup';
  phone: string | null;
  tg_user_id: string | null;
  address: string | null;
};

export type Request = {
  id: number;
  description: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  source: 'website' | 'tg';
  created_at: string;
} & RequestData;
