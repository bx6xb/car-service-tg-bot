import { Markup } from 'telegraf';
import { bot } from '../config';
import { Warranty, WarrantyApi } from '../api';
import { logError, msDays } from '../lib';

type Action = 'enable' | 'pause' | 'disable';

const notificationsMenu = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('🔔 Включить уведомления', 'action-enable')],
    [Markup.button.callback('🔕 Отключить до следующего ТО', 'action-pause')],
    [Markup.button.callback('🧹 Сбросить гарантию', 'action-disable')],
    [Markup.button.callback('Вернуться назад', 'back')],
  ]);

const goBackMenu = () =>
  Markup.inlineKeyboard([[Markup.button.callback('Вернуться назад', 'back')]]);

const warrantiesMenu = (warranties: Warranty[], action: Action) =>
  Markup.inlineKeyboard([
    ...warranties.map((w) => [
      Markup.button.callback(`🔋 ${w.battery_name}`, `warranty-${action}-${w.id}`),
    ]),
    [Markup.button.callback('Вернуться назад', 'back')],
  ]);

bot.command('toggle_warranty', async (ctx) => {
  await ctx.reply('🔔 Отключить/включить напоминания', notificationsMenu());
});

bot.action('back', async (ctx) => {
  await ctx.editMessageText('🔔 Отключить/включить напоминания', notificationsMenu());
});

bot.on('callback_query', async (ctx) => {
  if (!('data' in ctx.callbackQuery) || !ctx.callbackQuery.data) return;

  const userId = ctx.from.id;
  const data = ctx.callbackQuery.data;

  if (data.startsWith('action-')) {
    const action = data.split('-')[1] as Action;

    await ctx.editMessageText('⏳ Гарантии загружаются...');

    try {
      const warranties = await WarrantyApi.getUserWarranties(userId);

      if (warranties.length === 0) {
        return await ctx.editMessageText('У вас нет текущих гарантий', goBackMenu());
      }

      const text =
        action === 'enable'
          ? '🔔 Включить уведомления'
          : action === 'pause'
            ? '🔕 Отключить до следующего ТО'
            : '🧹 Сбросить гарантию';

      return await ctx.editMessageText(text, warrantiesMenu(warranties, action));
    } catch (e) {
      logError(e, 'Failed to fetch warranties');
      return await ctx.editMessageText('Произошла ошибка при загрузке гарантий', goBackMenu());
    }
  }

  if (data.startsWith('warranty-')) {
    const args = data.split('-');
    const action = args[1] as Action;
    const warrantyId = +args[2];

    if (action === 'enable') {
      try {
        await WarrantyApi.enableWarranty(warrantyId, userId);
        return await ctx.editMessageText(
          'Уведомления включены для выбранной гарантии.',
          goBackMenu(),
        );
      } catch (e) {
        logError(e, 'Failed to enable warranty', { warrantyId, userId });
        return await ctx.editMessageText(
          'Произошла ошибка при включении уведомлений',
          goBackMenu(),
        );
      }
    }

    if (action === 'pause') {
      const date = await WarrantyApi.getUserStartDate(warrantyId, userId);

      if (!date) return await ctx.editMessageText('Гарантия не найдена', goBackMenu());

      const startDate = Number(date.start_date);
      const now = Date.now();

      const MS_IN_90_DAYS = msDays(90);

      // Считаем, сколько 90-дневных интервалов прошло
      const intervalsPassed = Math.floor((now - startDate) / MS_IN_90_DAYS);

      // Следующая дата ТО
      const nextTODate = startDate + (intervalsPassed + 1) * MS_IN_90_DAYS;

      try {
        await WarrantyApi.pauseWarranty(nextTODate, warrantyId, userId);
        return await ctx.editMessageText(
          'Уведомления приостановлены до следующего ТО для выбранной гарантии.',
          goBackMenu(),
        );
      } catch (e) {
        logError(e, 'Failed to pause warranty', { warrantyId, userId });
        return await ctx.editMessageText(
          'Произошла ошибка при отключении уведомлений',
          goBackMenu(),
        );
      }
    }

    if (action === 'disable') {
      try {
        await WarrantyApi.removeWarranty(warrantyId);
        return await ctx.editMessageText(
          'Уведомления отключены навсегда для выбранной гарантии.',
          goBackMenu(),
        );
      } catch (e) {
        logError(e, 'Failed to remove warranty', { warrantyId, userId });
        return await ctx.editMessageText(
          'Произошла ошибка при отключении уведомлений',
          goBackMenu(),
        );
      }
    }
  }

  return await ctx.editMessageText('Неверная команда.', goBackMenu());
});
