import { WarrantyApi } from '../api';
import { bot } from '../config';
import { logError, msDays } from '../lib';

bot.command('toggle_warranty', async (ctx) => {
  const userId = ctx.from.id;
  const [idStr, action] = ctx.message.text.split(' ').slice(1);
  const id = parseInt(idStr);

  if (!idStr || !action || isNaN(id)) {
    return ctx.reply('Пример: /toggle_warranty 1 pause | disable | enable');
  }

  if (action === 'pause') {
    const date = await WarrantyApi.getUserStartDate(id, userId);

    if (!date) {
      return ctx.reply('Напоминание не найдено.');
    }

    const startDate = Number(date.start_date); // в миллисекундах
    const now = Date.now();

    const MS_IN_90_DAYS = msDays(90);

    // Считаем, сколько 90-дневных интервалов прошло
    const intervalsPassed = Math.floor((now - startDate) / MS_IN_90_DAYS);

    // Следующая дата ТО
    const nextTODate = startDate + (intervalsPassed + 1) * MS_IN_90_DAYS;

    try {
      await WarrantyApi.pauseWarranty(nextTODate, id, userId);
      return ctx.reply('Уведомления приостановлены до следующего ТО.');
    } catch (e) {
      logError(e, 'Failed to pause warranty', { warrantyId: id, userId });
      return ctx.reply('Произошла ошибка при отключении уведомлений, обратитесь в поддержку');
    }
  }

  if (action === 'disable') {
    try {
      await WarrantyApi.removeWarranty(id);
      return ctx.reply('Уведомления отключены навсегда.');
    } catch (e) {
      logError(e, 'Failed to remove warranty', { warrantyId: id, userId });
      return ctx.reply('Произошла ошибка при отключении уведомлений, обратитесь в поддержку');
    }
  }

  if (action === 'enable') {
    try {
      WarrantyApi.enableWarranty(id, userId);
      return ctx.reply('Уведомления снова включены.');
    } catch (e) {
      logError(e, 'Failed to enable warranty', { warrantyId: id, userId });
      return ctx.reply('Произошла ошибка при включении уведомлений, обратитесь в поддержку');
    }
  }

  return ctx.reply('Неверная команда.');
});
