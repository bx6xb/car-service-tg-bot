import { WarrantyApi } from '../api';
import { bot } from '../config';
import { escapeMarkdownV2, formatDate, logError, msDays, sendTempMessage } from '../lib';

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
    const startDate = new Date().setHours(0, 0, 0, 0);
    const formattedStartDate = formatDate(startDate, false);
    const nextServiceDate = formatDate(startDate + msDays(90), false);

    await WarrantyApi.createWarranty({ userId, batteryName, duration, startDate });

    const text = `✅ *Гарантия успешно создана!*

🔋 Аккумулятор: *«${batteryName}»*
📅 Дата покупки: *${formattedStartDate}*
⏰ Срок гарантии: *${duration}*
🔧 Ближайшее ТО: *${nextServiceDate}*

Мы пришлем вам уведомление:
⏰ За *20 дней* и за *10 дней* до ТО,
чтобы вы не пропустили обслуживание и сохранили расширенную гарантию.

Спасибо, что выбрали *«Ампер»*! ⚡️`;

    await ctx.reply(escapeMarkdownV2(text), { parse_mode: 'MarkdownV2' });
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
