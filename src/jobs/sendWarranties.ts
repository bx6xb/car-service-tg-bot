import { bot } from '../config';
import { escapeMarkdownV2, logError } from '../lib';
import { WarrantyService } from '../services';

export const sendWarranties = async () => {
  try {
    const reminders = await WarrantyService.getReminders();

    for (const { userId, batteryName, type } of reminders) {
      try {
        if (type === 'expired') {
          await bot.telegram.sendMessage(userId, `Гарантия на «${batteryName}» завершена.`);
          continue;
        }

        const text =
          type === '10days'
            ? `📅 *Напоминание о ТО:*

⚠️ ВАЖНО! До окончания срока на ТО аккумулятора «*${batteryName}*» осталось *10 дней*.

Без прохождения ТО ваша *расширенная гарантия аннулируется*, и останется только *стандартная — 1 год.*

🚗 Успейте заехать в «Ампер» — ТО бесплатное, быстрое и без очередей!

📍 г. Таганрог, Мариупольское шоссе, 1
📞 [8-989-722-80-95](https://t.me/+89897228095)`
            : `📅 *Напоминание о ТО:*

🔔 Пора на ТО для сохранения расширенной гарантии на ваш аккумулятор «*${batteryName}*».

Прошло почти 3 месяца  с момента покупки/прохождения крайнего ТО

✅ Чтобы сохранить расширенную гарантию, необходимо пройти бесплатное техобслуживание в течение ближайших 20 дней.
Процедура занимает всего пару минут и не требует записи.

📍 г. Таганрог, Мариупольское шоссе, 1
📞 [8-989-722-80-95](https://t.me/+89897228095)`;

        await bot.telegram.sendMessage(userId, escapeMarkdownV2(text), {
          parse_mode: 'MarkdownV2',
        });
      } catch (e) {
        logError(e, 'Failed to send warranty reminder');
      }
    }
  } catch (e) {
    logError(e, 'Failed to process warranty reminders');
  }
};
