import { WarrantyApi } from '../api';
import { bot } from '../config';
import { escapeMarkdownV2, logError, msDays } from '../lib';

export const sendWarranties = async () => {
  const now = new Date().setHours(0, 0, 0, 0);

  const warranties = await WarrantyApi.getAllWarranties();

  for (const w of warranties) {
    const { id, user_id, battery_name, start_date, duration_months, notifications_paused_until } =
      w;

    // Если уведомления временно приостановлены до определённой даты
    if (notifications_paused_until && now < notifications_paused_until) continue;

    if (notifications_paused_until && now >= notifications_paused_until) {
      try {
        await WarrantyApi.enableWarranty(id, user_id);
      } catch (e) {
        logError(e, 'Failed to enable warranty notification');
      }
      continue;
    }

    // Общая продолжительность гарантии в миллисекундах
    const totalDuration = duration_months * msDays(30);

    // Если срок гарантии уже прошёл — удаляем напоминание
    if (now >= start_date + totalDuration) {
      try {
        await WarrantyApi.removeWarranty(id);
        await bot.telegram.sendMessage(user_id, `Гарантия на «${battery_name}» завершена.`);
      } catch (e) {
        logError(e, 'Failed to remove warranty');
      }

      continue;
    }

    // Подсчёт количества 90-дневных периодов, которые уже прошли
    const monthsPassed = Math.floor((now - start_date) / msDays(90));

    // Следующий ТО = дата старта + количество прошедших ТО * 90 дней
    const nextTO = start_date + (monthsPassed + 1) * msDays(90);
    const in10DaysToday = nextTO - msDays(10) === now;
    const in20DaysToday = nextTO - msDays(20) === now;

    if (in10DaysToday) {
      const text = `📅 *Напоминание о ТО:*

⚠️ ВАЖНО! До окончания срока на ТО аккумулятора «*${battery_name}*» осталось *10 дней*.

Без прохождения ТО ваша *расширенная гарантия аннулируется*, и останется только *стандартная — 1 год.*

🚗 Успейте заехать в «Ампер» — ТО бесплатное, быстрое и без очередей!

📍 г. Таганрог, Мариупольское шоссе, 1
📞 [8-989-722-80-95](https://t.me/+89897228095)`;
      bot.telegram.sendMessage(user_id, escapeMarkdownV2(text), {
        parse_mode: 'MarkdownV2',
      });

      continue;
    }

    if (in20DaysToday) {
      const text = `📅 *Напоминание о ТО:*

🔔 Пора на ТО для сохранения расширенной гарантии на ваш аккумулятор «*${battery_name}*».

Прошло почти 3 месяца  с момента покупки/прохождения крайнего ТО

✅ Чтобы сохранить расширенную гарантию, необходимо пройти бесплатное техобслуживание в течение ближайших 20 дней.
Процедура занимает всего пару минут и не требует записи.

📍 г. Таганрог, Мариупольское шоссе, 1
📞 [8-989-722-80-95](https://t.me/+89897228095)`;

      bot.telegram.sendMessage(user_id, escapeMarkdownV2(text), {
        parse_mode: 'MarkdownV2',
      });

      continue;
    }
  }
};
