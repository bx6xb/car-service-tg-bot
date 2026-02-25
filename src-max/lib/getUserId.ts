import { Context } from '@maxhub/max-bot-api';

export const getUserId = (ctx: Context): number | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update = (ctx as any).update;
  return (
    update?.user?.user_id ??
    update?.callback?.user?.user_id ??
    update?.message?.sender?.user_id ??
    undefined
  );
};

export const getCtxUsername = (ctx: Context): string | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update = (ctx as any).update;
  return (
    update?.user?.username ??
    update?.callback?.user?.username ??
    update?.message?.sender?.username ??
    undefined
  );
};
