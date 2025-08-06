import { Markup } from 'telegraf';
import { bot } from '../config';
import { Warranty, WarrantyApi } from '../api';
import { editMessageText, escapeMarkdownV2, goBackMenu, logError, msDays } from '../lib';

type Action =
  // 'enable' |
  'pause' | 'disable';

const notificationsMenu = () =>
  Markup.inlineKeyboard([
    // [Markup.button.callback('🔔 Включить уведомления', 'action-enable')],
    [Markup.button.callback('🔕 Отключить до следующего ТО', 'action-pause')],
    [Markup.button.callback('🚫 Сбросить гарантию', 'action-disable')],
    [Markup.button.callback('↩️ Назад', 'service')],
  ]);

const warrantiesMenu = (warranties: Warranty[], action: Action) =>
  Markup.inlineKeyboard([
    ...warranties.map((w) => [
      Markup.button.callback(`🔋 ${w.battery_name}`, `warranty-${action}-${w.id}`),
    ]),
    [Markup.button.callback('↩️ Назад', 'warranty_toggle')],
  ]);

bot.action('warranty_toggle', async (ctx) => {
  await ctx.answerCbQuery();
  await editMessageText(ctx, '🔔 Отключить/включить напоминания', notificationsMenu());
});

bot.on('callback_query', async (ctx) => {
  if (!('data' in ctx.callbackQuery) || !ctx.callbackQuery.data) return;

  const userId = ctx.from.id;
  const data = ctx.callbackQuery.data;

  if (data.startsWith('action-')) {
    const action = data.split('-')[1] as Action;

    await editMessageText(ctx, '⏳ Загружаем гарантии...');

    try {
      const warranties = await WarrantyApi.getUserWarranties(userId);

      if (warranties.length === 0) {
        return await editMessageText(
          ctx,
          '📅 У вас нет зарегистрированных гарантийных сроков',
          goBackMenu('warranty_toggle'),
        );
      }

      const text =
        // action === 'enable'
        //   ? '🔔 Включить уведомления'
        //   :
        action === 'pause' ? '🔕 Отключить до следующего ТО' : '🚫 Сбросить гарантию';

      return await editMessageText(ctx, text, warrantiesMenu(warranties, action));
    } catch (e) {
      logError(e, 'Failed to fetch warranties');
      return await editMessageText(
        ctx,
        '❌ Произошла ошибка при загрузке гарантий',
        goBackMenu('warranty_toggle'),
      );
    }
  }

  if (data.startsWith('warranty-')) {
    const args = data.split('-');
    const action = args[1] as Action;
    const warrantyId = +args[2];

    //     if (action === 'enable') {
    //       try {
    //         await WarrantyApi.enableWarranty(warrantyId, userId);

    //         const text = `🔔 *Уведомления включены*
    // Напоминания о техническом осмотре для выбранного аккумулятора активны.
    // Мы напомним вам заранее, чтобы сохранить расширенную гарантию!`;

    //         return await editMessageText(ctx, escapeMarkdownV2(text), {
    //           parse_mode: 'MarkdownV2',
    //           reply_markup: goBackMenu('warranty_toggle).reply_markup,
    //         });
    //       } catch (e) {
    //         logError(e, 'Failed to enable warranty', { warrantyId, userId });
    //         return await editMessageText(ctx,
    //           '❌ Произошла ошибка при включении уведомления',
    //           goBackMenu('warranty_toggle),
    //         );
    //       }
    //     }

    if (action === 'pause') {
      const date = await WarrantyApi.getUserStartDate(warrantyId, userId);

      if (!date)
        return await editMessageText(ctx, '❌ Гарантия не найдена', goBackMenu('warranty_toggle'));

      const startDate = date.start_date;
      const now = Date.now();

      const MS_IN_90_DAYS = msDays(90);

      // Считаем, сколько 90-дневных интервалов прошло
      const intervalsPassed = Math.floor((now - startDate) / MS_IN_90_DAYS);

      // Следующая дата ТО
      const nextTODate = startDate + (intervalsPassed + 1) * MS_IN_90_DAYS;

      try {
        await WarrantyApi.pauseWarranty(nextTODate, warrantyId, userId);

        const text = `🔕 *Уведомления отключены до следующего ТО*
Напоминания приостановлены, для выбранного АКБ
Следующее уведомления придут за 20 дней и 10 дней до следующего планового осмотра.`;

        return await editMessageText(ctx, escapeMarkdownV2(text), {
          parse_mode: 'MarkdownV2',
          reply_markup: goBackMenu('warranty_toggle').reply_markup,
        });
      } catch (e) {
        logError(e, 'Failed to pause warranty', { warrantyId, userId });
        return await editMessageText(
          ctx,
          '❌ Произошла ошибка при отключении уведомления',
          goBackMenu('warranty_toggle'),
        );
      }
    }

    if (action === 'disable') {
      try {
        await WarrantyApi.removeWarranty(warrantyId);

        const text = `🚫 *Уведомления отключены навсегда*
Напоминания по этому аккумулятору отключены.
Мы остаёмся на связи — если что, пишите! ⚡️`;

        return await editMessageText(ctx, escapeMarkdownV2(text), {
          parse_mode: 'MarkdownV2',
          reply_markup: goBackMenu('warranty_toggle').reply_markup,
        });
      } catch (e) {
        logError(e, 'Failed to remove warranty', { warrantyId, userId });
        return await editMessageText(
          ctx,
          '❌ Произошла ошибка при отключении уведомления',
          goBackMenu('warranty_toggle'),
        );
      }
    }
  }

  return await editMessageText(ctx, '❌ Неверная команда', goBackMenu('menu_main'));
});
