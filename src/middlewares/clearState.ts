import { textState } from '../commands/state';
import { bot } from '../config';

bot.use(async (ctx, next) => {
  const userId = ctx.message?.chat.id;

  if (
    userId &&
    'text' in ctx.message &&
    ctx.message.text.startsWith('/') &&
    !['/new_broadcast', '/broadcasts'].includes(ctx.message.text)
  ) {
    textState.delete(userId);
  }

  await next();
});
