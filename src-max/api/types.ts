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

export type BotMessage = {
  id: number;
  message_id: string;
  chat_id: number;
  created_at: number;
};

export type RequestData = {
  car_brand: string;
  car_model: string;
  engine_type: 'petrol' | 'diesel';
  engine_volume: string | null;
  production_year: number;
  delivery_method: 'delivery' | 'pickup';
  phone: string | null;
  tg_user_id: string | null;
  max_user_id: string | null;
  address: string | null;
};

export type Request = {
  id: number;
  description: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  source: 'website' | 'tg' | 'max';
  created_at: string;
} & RequestData;

export type Product = {
  id: number;
  title: string;
  image: string;
  manufacturer: string;
  longitude: number;
  height: number;
  width: number;
  capacity: string;
  current: number;
  polarity: string;
  recommendations: number;
  relevance: number;
  priceWithChange: number;
  popular: number;
  standardPrice: number;
  maintenanceSaving: number;
  admin_picked: boolean;
  created_at: string;
  updated_at: string;
};
