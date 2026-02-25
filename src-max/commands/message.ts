import { Keyboard } from '@maxhub/max-bot-api';
import { bot } from '../config';
import {
  batterySelectSteps,
  broadcastsSteps,
  createWarrantySteps,
  newBroadcastSteps,
  requestSteps,
  textState,
} from './state';
import { formatDate, logError, getUserId, selectBatteryLastStep } from '../lib';
import { BroadcastService, WarrantyService } from '../services';

bot.on('message_created', async (ctx) => {
  const text = ctx.message?.body.text ?? '';

  // Handle contact info shared via button
  if (ctx.contactInfo) {
    const phoneNumber = ctx.contactInfo.tel;
    const userId = getUserId(ctx);
    if (!userId || !phoneNumber) return;

    if (
      textState.get(userId) === 'select_battery' &&
      batterySelectSteps.get(userId)?.step === 'phone'
    ) {
      const batterySelectData = batterySelectSteps.get(userId);
      batterySelectSteps.set(userId, { ...batterySelectData, step: 'address', phone: phoneNumber });

      if (batterySelectData?.delivery_method === 'delivery') {
        await ctx.reply('Введите адрес доставки');
      } else {
        selectBatteryLastStep(ctx);
      }
    }
    return;
  }

  if (!text) return;

  const userId = getUserId(ctx);
  if (!userId) return;

  const userState = textState.get(userId);

  // ── Admin: new broadcast ───────────────────────────────────────────────────
  if (userState === 'new_broadcast') {
    const userStep = newBroadcastSteps.get(userId);

    if (userStep?.step === 'message') {
      newBroadcastSteps.set(userId, { step: 'date', messageText: text });
      await ctx.reply('Напишите время рассылки в формате ДД.ММ.ГГГГ');
      return;
    }

    if (userStep?.step === 'date') {
      if (!BroadcastService.validateDate(text)) {
        await ctx.reply('❌ Введите корректную дату в формате ДД.ММ.ГГГГ');
        return;
      }

      const messageText = newBroadcastSteps.get(userId)?.messageText;
      newBroadcastSteps.set(userId, { step: 'time', date: text, messageText });

      await ctx.reply('Выберите время рассылки:', {
        attachments: [
          Keyboard.inlineKeyboard([
            [
              Keyboard.button.callback('09:00', 'step:time:0900'),
              Keyboard.button.callback('17:00', 'step:time:1700'),
            ],
          ]),
        ],
      });
      return;
    }

    return;
  }

  // ── Admin: delete broadcast ────────────────────────────────────────────────
  if (userState === 'broadcasts') {
    if (!broadcastsSteps.has(userId)) return;

    const broadcasts = broadcastsSteps.get(userId);
    if (!broadcasts) return;

    if (!(text in broadcasts)) {
      await ctx.reply('❌ Рассылки с таким номером нет, введите корректный номер');
      return;
    }

    try {
      await BroadcastService.remove(broadcasts[text]);

      textState.delete(userId);
      broadcastsSteps.delete(userId);
      await ctx.reply('Рассылка успешно удалена');
    } catch (e) {
      logError(e, 'Failed to remove broadcast');
      return await ctx.reply('❌ Произошла ошибка при удалении рассылки, введите номер ещё раз');
    }
  }

  // ── Battery request form ───────────────────────────────────────────────────
  if (userState === 'battery_request') {
    const userStep = requestSteps.get(userId);
    const requestData = requestSteps.get(userId);

    if (userStep?.step === 'car_brand') {
      requestSteps.set(userId, { ...requestData, step: 'car_model', car_brand: text });
      await ctx.reply('Введите модель автомобиля');
      return;
    }

    if (userStep?.step === 'car_model') {
      requestSteps.set(userId, { ...requestData, step: 'engine_type', car_model: text });
      await ctx.reply('Выберите тип двигателя:', {
        attachments: [
          Keyboard.inlineKeyboard([
            [
              Keyboard.button.callback('Бензин', 'step:engine:petrol'),
              Keyboard.button.callback('Дизель', 'step:engine:diesel'),
            ],
          ]),
        ],
      });
      return;
    }

    if (userStep?.step === 'engine_volume') {
      requestSteps.set(userId, { ...requestData, step: 'production_year', engine_volume: text });
      await ctx.reply('Введите год выпуска');
      return;
    }

    if (userStep?.step === 'production_year') {
      const match = text.trim().match(/^\d{4}$/);
      if (!match) {
        await ctx.reply('❌ Введите год в формате ГГГГ');
        return;
      }

      requestSteps.set(userId, { ...requestData, step: 'delivery_method', production_year: +text });

      await ctx.reply('Выберите способ получения:', {
        attachments: [
          Keyboard.inlineKeyboard([
            [Keyboard.button.callback('С доставкой и установкой', 'step:delivery:delivery')],
            [Keyboard.button.callback('Самовывоз', 'step:delivery:pickup')],
          ]),
        ],
      });
      return;
    }

    return;
  }

  // ── Create warranty ───────────────────────────────────────────────────────
  if (userState === 'create_warranty') {
    const step = createWarrantySteps.get(userId);

    const cleanUp = (extraMid?: string) => {
      const mids = [step?.commandMid, step?.promptMid, ctx.messageId, extraMid].filter(
        Boolean,
      ) as string[];
      mids.forEach((mid) => ctx.deleteMessage(mid).catch(() => {}));
      textState.delete(userId);
      createWarrantySteps.delete(userId);
    };

    const args = text.trim().split(/\s+/);

    if (args.length < 2) {
      const err = await ctx.reply('❌ Неверный формат. Пример: <i>аккумулятор для гелика 24</i>', {
        format: 'html',
      });
      setTimeout(() => cleanUp(err.body.mid), 4000);
      return;
    }

    const durationStr = args.slice(-1)[0];
    const match = durationStr.match(/^\d+$/);
    const batteryName = args.slice(0, -1).join(' ');

    if (!match) {
      const err = await ctx.reply('❌ Срок гарантии неправильно указан', { format: 'html' });
      setTimeout(() => cleanUp(err.body.mid), 4000);
      return;
    }

    const duration = +durationStr;

    if (![18, 24, 36, 48].includes(duration)) {
      const err = await ctx.reply('❌ Срок гарантии должен быть 18/24/36/48 мес');
      setTimeout(() => cleanUp(err.body.mid), 4000);
      return;
    }

    try {
      const { startDate, nextServiceDate } = await WarrantyService.create(
        userId,
        batteryName,
        duration,
      );

      await ctx.reply(
        `✅ <b>Гарантия успешно создана!</b>\n\n🔋 Аккумулятор: <b>«${batteryName}»</b>\n📅 Дата покупки: <b>${formatDate(startDate, false)}</b>\n⏰ Срок гарантии: <b>${duration}</b>\n🔧 Ближайшее ТО: <b>${formatDate(nextServiceDate, false)}</b>\n\nМы пришлем вам уведомление:\n⏰ За <b>20 дней</b> и за <b>10 дней</b> до ТО,\nчтобы вы не пропустили обслуживание и сохранили расширенную гарантию.\n\nСпасибо, что выбрали <b>«Ампер»</b>! ⚡️`,
        { format: 'html' },
      );
    } catch (e) {
      logError(e, 'Failed to create warranty', { userId, batteryName, duration });
      const err = await ctx.reply('❌ Не удалось создать гарантию');
      setTimeout(() => cleanUp(err.body.mid), 4000);
    }

    return;
  }

  // ── Battery select: phone & address ───────────────────────────────────────
  if (userState === 'select_battery') {
    const userStep = batterySelectSteps.get(userId);

    if (userStep?.step === 'phone') {
      // eslint-disable-next-line no-useless-escape
      if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(text.trim())) {
        return await ctx.reply('Неправильный формат телефона, введите ещё раз начиная с +7');
      }

      const batterySelectData = batterySelectSteps.get(userId);
      batterySelectSteps.set(userId, { ...batterySelectData, step: 'address', phone: text });

      if (batterySelectData?.delivery_method === 'delivery') {
        await ctx.reply('Введите адрес доставки');
      } else {
        selectBatteryLastStep(ctx);
      }
    }

    if (userStep?.step === 'address') {
      selectBatteryLastStep(ctx, text);
    }

    return;
  }
});
