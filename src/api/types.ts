export type User = {
  user_id: number;
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
  created_at: number;
};
