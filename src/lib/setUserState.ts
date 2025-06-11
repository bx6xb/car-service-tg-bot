import { APP_STATE, UserState } from '../api';

export const setUserState = (userId: number, state: UserState): void => {
  APP_STATE.users = APP_STATE.users.map((user) =>
    user.userId === userId
      ? {
          ...user,
          state,
        }
      : user,
  );
};
