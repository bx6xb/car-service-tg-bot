import { Keyboard } from '@maxhub/max-bot-api';
import { bot } from '../config';
import { editMessageText } from '../lib';

const notificationsMenu = () =>
  Keyboard.inlineKeyboard([
    [Keyboard.button.callback('🔕 Отключить до следующего ТО', 'action-pause')],
    [Keyboard.button.callback('🚫 Сбросить гарантию', 'action-disable')],
    [Keyboard.button.callback('↩️ Назад', 'service')],
  ]);

bot.action('warranty_toggle', async (ctx) => {
  await ctx.answerOnCallback({ notification: '' });
  await editMessageText(ctx, '🔔 Отключить/включить напоминания', notificationsMenu());
});
