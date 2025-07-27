export type User = {
  user_id: number;
};

export interface Broadcast {
  id: number;
  message: string;
  scheduled_at: number;
}
