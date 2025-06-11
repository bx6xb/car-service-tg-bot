export type NotificationGeneral = {
  id: string;
  message: string;
  timestamp: number;
};

export type UsersResponse = {
  user_id: number;
  utc: number | null;
}[];

export type PublicNotificationResponse = NotificationGeneral;

export type UserNotificationResponse = {
  user_id: number;
} & NotificationGeneral;

export type PublicNotification = {
  type: 'public';
} & PublicNotificationResponse;

export type UserNotification = {
  type: 'user';
} & UserNotificationResponse;

export type UserState = 'idle' | 'set_date';

export type User = {
  userId: number;
  utc: number | null;
  state: UserState;
};

export type AppState = {
  users: User[];
  notifications: (PublicNotification | UserNotification)[];
};
