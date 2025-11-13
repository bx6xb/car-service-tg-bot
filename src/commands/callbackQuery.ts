import { Markup } from 'telegraf';
import { ProductsApi, Request, WarrantyApi } from '../api';
import { warrantiesMenu, WarrantyAction } from '../buttons';
import { bot, supabase } from '../config';
import {
  createImagePath,
  editMessageText,
  escapeMarkdownV2,
  goBackMenu,
  logError,
  msDays,
} from '../lib';
import { batterySelectSteps, textState } from './state';

bot.on('callback_query', async (ctx) => {
  if (!('data' in ctx.callbackQuery) || !ctx.callbackQuery.data) return;

  const userId = ctx.from.id;
  const data = ctx.callbackQuery.data;

  if (data.startsWith('action-')) {
    const action = data.split('-')[1] as WarrantyAction;

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
    const action = args[1] as WarrantyAction;
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

  if (data.startsWith('select-battery-')) {
    const requestId = +data.split('-')[2];
    const batteryId = +data.split('-')[3];

    const { data: request, error } = await supabase
      .from('battery_requests')
      .select('*')
      .eq('id', requestId)
      .single<Request>();

    const product = await ProductsApi.getProductById(batteryId);

    if (error) {
      return await ctx.reply('Произошла ошибка, попробуйте ещё раз');
    }
    if (request?.status === 'completed' || request?.status === 'cancelled') {
      return await ctx.reply('Заявка была завершена или отменена');
    }
    if (request?.address) {
      return await ctx.reply('Вы уже выбрали аккумулятор для этой заявки');
    }

    const batteryText = `${product.title}

Ёмкость: ${product.capacity}
Пусковой ток: ${product.current}
Полярность: ${product.polarity}
Габариты: ${product.longitude}x${product.width}x${product.height}
Изготовитель: ${product.manufacturer}
Обычная цена: ${product.standardPrice} ₽
Цена со сдачей: ${product.priceWithChange} ₽`;

    const batterySelectData = batterySelectSteps.get(userId);

    textState.set(userId, 'select_battery');
    batterySelectSteps.set(userId, {
      ...batterySelectData,
      step: 'confirm',
      battery: batteryText,
      id: requestId,
      delivery_method: request.delivery_method,
    });

    return await ctx.sendPhoto(createImagePath(product.image), {
      caption: `Вы выбрали\n\n${batteryText}\n\nПодтверждаете свой выбор?`,
      reply_markup: Markup.keyboard([['Да'], ['Нет']])
        .oneTime()
        .resize().reply_markup,
    });
  }

  return await editMessageText(ctx, '❌ Неверная команда', goBackMenu('menu_main'));
});
