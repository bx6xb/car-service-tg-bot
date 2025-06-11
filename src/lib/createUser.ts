import { User } from '../api';

export const createUser = (userId: number, utc?: number | null): User => ({
  userId,
  utc: utc ?? null,
  state: 'idle',
});
