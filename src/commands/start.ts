import { Api, APP_STATE } from '../api';
import { bot } from '../config';
import { createUser, logError, setUserState } from '../lib';

bot.start(async (ctx) => {
  ctx.reply('Привет! Этот');

  if (!ctx.chat) return;

  const userId = ctx.chat.id;

  const user = APP_STATE.users.find((user) => user.userId === userId);

  if (!user) {
    try {
      await Api.addNewUser(userId);
    } catch (e) {
      logError(e, 'Failed to add user', { userId });
    }

    APP_STATE.users.push(createUser(userId));
    setUserState(userId, 'set_date');
  }
});
