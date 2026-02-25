import { bot } from '../config';
import { logError } from '../lib';
import { WarrantyService } from '../services';

export const sendWarranties = async () => {
  try {
    const reminders = await WarrantyService.getReminders();

    for (const { userId, batteryName, type } of reminders) {
      try {
        if (type === 'expired') {
          await bot.api.sendMessageToUser(userId, `Гарантия на «${batteryName}» завершена.`);
          continue;
        }

        const text =
          type === '10days'
            ? `📅 <b>Напоминание о ТО:</b>\n\n⚠️ ВАЖНО! До окончания срока на ТО аккумулятора «<b>${batteryName}</b>» осталось <b>10 дней</b>.\n\nБез прохождения ТО ваша <b>расширенная гарантия аннулируется</b>, и останется только <b>стандартная — 1 год.</b>\n\n🚗 Успейте заехать в «Ампер» — ТО бесплатное, быстрое и без очередей!\n\n📍 г. Таганрог, Мариупольское шоссе, 1\n📞 8-989-722-80-95`
            : `📅 <b>Напоминание о ТО:</b>\n\n🔔 Пора на ТО для сохранения расширенной гарантии на ваш аккумулятор «<b>${batteryName}</b>».\n\nПрошло почти 3 месяца  с момента покупки/прохождения крайнего ТО\n\n✅ Чтобы сохранить расширенную гарантию, необходимо пройти бесплатное техобслуживание в течение ближайших 20 дней.\nПроцедура занимает всего пару минут и не требует записи.\n\n📍 г. Таганрог, Мариупольское шоссе, 1\n📞 8-989-722-80-95`;

        await bot.api.sendMessageToUser(userId, text, { format: 'html' });
      } catch (e) {
        logError(e, 'Failed to send warranty reminder');
      }
    }
  } catch (e) {
    logError(e, 'Failed to process warranty reminders');
  }
};
