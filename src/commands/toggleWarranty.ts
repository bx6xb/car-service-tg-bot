import { Markup } from 'telegraf';
import { bot } from '../config';
import { editMessageText } from '../lib';

const notificationsMenu = () =>
  Markup.inlineKeyboard([
    // [Markup.button.callback('🔔 Включить уведомления', 'action-enable')],
    [Markup.button.callback('🔕 Отключить до следующего ТО', 'action-pause')],
    [Markup.button.callback('🚫 Сбросить гарантию', 'action-disable')],
    [Markup.button.callback('↩️ Назад', 'service')],
  ]);

bot.action('warranty_toggle', async (ctx) => {
  await ctx.answerCbQuery();
  await editMessageText(ctx, '🔔 Отключить/включить напоминания', notificationsMenu());
});
