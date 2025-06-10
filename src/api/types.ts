export type NotificationGeneral = {
  id: string;
  message: string;
  timestamp: number;
};

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

export type AppState = {
  users: number[];
  notifications: (PublicNotification | UserNotification)[];
};
