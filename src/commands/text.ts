import { Markup } from 'telegraf';
import { ADMIN_IDS, bot } from '../config';
import { broadcastsSteps, newBroadcastSteps, requestSteps, textState } from './state';
import { BroadcastApi, RequestApi, RequestData } from '../api';
import {
  getDeliveryText,
  getEngineText,
  getSource,
  logError,
  notifyAdmins,
  pinMessage,
} from '../lib';
import { mainMenu } from './start';

bot.on('text', async (ctx) => {
  const userId = ctx.from?.id;
  const userState = textState.get(userId);
  const isAdmin = ADMIN_IDS.includes(userId);

  if (userState === 'new_broadcast' && isAdmin) {
    const userStep = newBroadcastSteps.get(userId);
    const text = ctx.message.text;

    if (userStep?.step === 'message') {
      newBroadcastSteps.set(userId, {
        step: 'date',
        messageText: text,
      });

      await ctx.reply('Напишите время рассылки в формате ДД.ММ.ГГГГ');
      return;
    }

    if (userStep?.step === 'date') {
      const match = text.match(/^(\d{1,2})\.(\d{1,2}).(\d{4})$/);
      if (!match) {
        await ctx.reply('❌ Введите корректную дату в формате ДД.ММ.ГГГГ');
        return;
      }

      const messageText = newBroadcastSteps.get(userId)?.messageText;

      newBroadcastSteps.set(userId, {
        step: 'time',
        date: text,
        messageText,
      });

      await ctx.reply(
        'Выберите время рассылки:',
        Markup.keyboard([['09:00'], ['17:00']])
          .oneTime()
          .resize(),
      );
      return;
    }

    if (userStep?.step === 'time') {
      if (text !== '09:00' && text !== '17:00') {
        await ctx.reply('❌ Выберите только 09:00 или 17:00');
        return;
      }

      const date = userStep.date;
      if (!date || !userStep.messageText) return;

      const [day, month, year] = date.split('.');
      const UTCHours = text === '09:00' ? '06' : '14';

      const isoString = `${year}-${month}-${day}T${UTCHours}:00:00`;
      const timestamp = new Date(isoString).getTime();

      try {
        await BroadcastApi.createBroadcast(userStep.messageText, timestamp);
      } catch (e) {
        logError(e, 'Failed to add new broadcast');
        return await ctx.reply('❌ Произошла ошибка при создании рассылки');
      }

      await ctx.reply(`Рассылка запланирована на ${text} по МСК`, Markup.removeKeyboard());

      textState.delete(userId);
      newBroadcastSteps.delete(userId);
      return;
    }

    return;
  }

  if (userState === 'broadcasts' && isAdmin) {
    const userId = ctx.from?.id;

    if (!broadcastsSteps.has(userId)) return;

    const broadcastNumber = ctx.message.text;
    const broadcasts = broadcastsSteps.get(userId);

    if (!broadcasts) return;

    if (!(broadcastNumber in broadcasts)) {
      await ctx.reply('❌ Рассылки с таким номером нет, введите корректный номер');
      return;
    }

    try {
      await BroadcastApi.removeBroadcast(broadcasts[broadcastNumber]);

      textState.delete(userId);
      broadcastsSteps.delete(userId);
      await ctx.reply('Рассылка успешно удалена');
    } catch (e) {
      logError(e, 'Failed to remove broadcast');
      return await ctx.reply('❌ Произошла ошибка при удалении рассылки, введите номер ещё раз');
    }
  }

  if (userState === 'battery_request') {
    const userStep = requestSteps.get(userId);
    const text = ctx.message.text;

    const requestData = requestSteps.get(userId);

    if (userStep?.step === 'car_brand') {
      requestSteps.set(userId, {
        ...requestData,
        step: 'car_model',
        car_brand: text,
      });

      await ctx.reply('Введите модель автомобиля');
      return;
    }

    if (userStep?.step === 'car_model') {
      requestSteps.set(userId, {
        ...requestData,
        step: 'engine_type',
        car_model: text,
      });

      await ctx.reply(
        'Выберите тип двигателя',
        Markup.keyboard([['Бензин'], ['Дизель']])
          .oneTime()
          .resize(),
      );
      return;
    }

    if (userStep?.step === 'engine_type') {
      if (text !== 'Бензин' && text !== 'Дизель') {
        await ctx.reply("❌ Выберите только 'Бензин' или 'Дизель'");
        return;
      }

      requestSteps.set(userId, {
        ...requestData,
        step: 'production_year',
        engine_type: text === 'Бензин' ? 'petrol' : 'diesel',
      });

      await ctx.reply('Введите год выпуска', Markup.removeKeyboard());
      return;
    }

    if (userStep?.step === 'production_year') {
      const match = text.trim().match(/^\d{4}$/);
      if (!match) {
        await ctx.reply('❌ Введите год в формате ГГГГ');
        return;
      }

      requestSteps.set(userId, {
        ...requestData,
        step: 'delivery_method',
        production_year: +text,
      });

      await ctx.reply(
        'Выберите способ получения',
        Markup.keyboard([['С доставкой и установкой'], ['Самовывоз']])
          .oneTime()
          .resize(),
      );
      return;
    }

    if (userStep?.step === 'delivery_method') {
      if (text !== 'С доставкой и установкой' && text !== 'Самовывоз') {
        await ctx.reply("❌ Выберите только 'С доставкой и установкой' или 'Самовывоз'");
        return;
      }

      requestSteps.set(userId, {
        ...requestData,
        step: 'delivery_method',
        delivery_method: text === 'С доставкой и установкой' ? 'delivery' : 'pickup',
        phone: userId.toString(),
      });

      const result = requestSteps.get(userId);

      if (result) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { step, ...data } = result;
        const request = await RequestApi.createRequest(data as RequestData);

        if (typeof request === 'string') {
          await ctx.reply(`❌ Произошла ошибка при создании заявки`, Markup.removeKeyboard());
          setTimeout(async () => {
            const { message_id } = await ctx.reply('📋 Главное меню:', mainMenu());
            await pinMessage(ctx, message_id);
          }, 1000);
          return;
        }

        await ctx.reply(
          `Готово! ⚙️
Менеджер Ян уже подбирает для вас подходящие аккумуляторы.
    
Чуть позже в этот чат придут варианты — просто дождитесь сообщения.👀`,
          Markup.removeKeyboard(),
        );

        setTimeout(async () => {
          const { message_id } = await ctx.reply('📋 Главное меню:', mainMenu());
          await pinMessage(ctx, message_id);
        }, 1000);

        const messageText = `*Новая заявка #${request.id}*
Марка авто: ${request.car_brand}
Модель авто: ${request.car_model}
Тип двигателя: ${getEngineText(request.engine_type)}
Год выпуска: ${request.production_year}
Способ получения: ${getDeliveryText(request.delivery_method)}
Телефон: ${request.phone}
Откуда: ${getSource(request.source)}`;

        notifyAdmins(messageText);
      }

      textState.delete(userId);
      requestSteps.delete(userId);

      return;
    }

    return;
  }
});
