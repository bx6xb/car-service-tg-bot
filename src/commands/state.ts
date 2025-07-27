export const textState = new Map<number, 'broadcasts' | 'new_broadcast'>();

export const newBroadcastSteps = new Map<
  number,
  {
    step: 'message' | 'date' | 'time';
    messageText?: string;
    date?: string;
  }
>();

export const broadcastsSteps = new Map<number, Record<string, number>>();
