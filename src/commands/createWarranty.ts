import { bot } from '../config';
import { escapeMarkdownV2, formatDate, logError, sendTempMessage } from '../lib';
import { WarrantyService } from '../services';

bot.command('w', async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);

  if (args.length < 2) {
    sendTempMessage({ ctx, ms: 4000 });
    return sendTempMessage({
      ctx,
      text: '❌ Неверный формат. Пример\n/команда аккумулятор для гелика 24',
    });
  }

  const durationStr = args.slice(-1)[0];
  const match = durationStr.match(/\d+/);
  const batteryName = args.slice(0, -1).join(' ');

  if (!match) {
    sendTempMessage({ ctx, ms: 4000 });
    return sendTempMessage({ ctx, text: '❌ Срок гарантии неправильно указан' });
  }

  const duration = +match[0];

  if (![18, 24, 36, 48].includes(duration)) {
    sendTempMessage({ ctx, ms: 4000 });
    return sendTempMessage({ ctx, text: '❌ Срок гарантии должен быть 18/24/36/48 мес' });
  }

  const userId = ctx.from.id;

  try {
    const { startDate, nextServiceDate } = await WarrantyService.create(
      userId,
      batteryName,
      duration,
    );

    const text = `✅ *Гарантия успешно создана!*

🔋 Аккумулятор: *«${batteryName}»*
📅 Дата покупки: *${formatDate(startDate, false)}*
⏰ Срок гарантии: *${duration}*
🔧 Ближайшее ТО: *${formatDate(nextServiceDate, false)}*

Мы пришлем вам уведомление:
⏰ За *20 дней* и за *10 дней* до ТО,
чтобы вы не пропустили обслуживание и сохранили расширенную гарантию.

Спасибо, что выбрали *«Ампер»*! ⚡️`;

    await ctx.reply(escapeMarkdownV2(text), { parse_mode: 'MarkdownV2' });
  } catch (e) {
    sendTempMessage({ ctx, text: '❌ Не удалось создать гарантию' });
    logError(e, 'Failed to create warranty', { userId, batteryName, duration });
  }

  sendTempMessage({ ctx, ms: 4000 });
});
