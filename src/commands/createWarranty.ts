import { WarrantyApi } from '../api';
import { bot } from '../config';
import { logError, sendTempMessage } from '../lib';

bot.command('create_warranty', async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);

  if (args.length < 2) {
    sendTempMessage({ ctx, ms: 4000 });
    return sendTempMessage({
      ctx,
      text: 'Неверный формат. Пример\n/команда аккумулятор для гелика 24',
    });
  }

  const durationStr = args.slice(-1)[0];
  const match = durationStr.match(/\d+/);
  const batteryName = args.slice(0, -1).join(' ');

  if (!match) {
    sendTempMessage({ ctx, ms: 4000 });
    return sendTempMessage({ ctx, text: 'Срок гарантии неправильно указан' });
  }

  const duration = +match[0];

  if (![18, 24, 36, 48].includes(duration)) {
    sendTempMessage({ ctx, ms: 4000 });
    return sendTempMessage({ ctx, text: 'Срок гарантии должен быть 18/24/36/48 мес' });
  }

  const userId = ctx.from.id;

  try {
    await WarrantyApi.createWarranty(userId, batteryName, duration);

    sendTempMessage({ ctx, text: `Гарантия для «${batteryName}» успешно создана.` });
  } catch (e) {
    sendTempMessage({ ctx, text: 'Не удалось создать гарантию' });

    logError(e, 'Failed to create warranty', {
      userId,
      batteryName,
      duration,
    });
  }

  sendTempMessage({ ctx, ms: 4000 });
});
