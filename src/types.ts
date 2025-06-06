export type UserNotification = {
  id: string;
  user_id: string;
  message: string;
  timestamp: number;
};

export type PublicNotification = {
  id: string;
  message: string;
  timestamp: number;
};
