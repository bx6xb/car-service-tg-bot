import { textState } from '../commands/state';
import { bot } from '../config';

bot.use(async (ctx, next) => {
  if (ctx.updateType === 'message_created') {
    const userId = ctx.user?.user_id;
    const text = ctx.message?.body.text;

    if (userId && text?.startsWith('/') && !['/nb', '/b'].includes(text.split(' ')[0])) {
      textState.delete(userId);
    }
  }

  await next();
});
