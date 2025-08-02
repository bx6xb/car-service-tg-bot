import { WarrantyApi } from '../api';
import { bot } from '../config';
import { msDays } from '../lib';

bot.command('next_to', async (ctx) => {
  const userId = ctx.from.id;
  const warranties = await WarrantyApi.getUserWarranties(userId);

  if (warranties.length === 0) return ctx.reply('У вас нет активных гарантий.');

  const now = Date.now();
  let message = 'Ближайшее ТО по каждому аккумулятору:\n\n';

  for (const w of warranties) {
    const { battery_name, start_date, duration_months } = w;
    const endDate = start_date + duration_months * msDays(30);

    if (now > endDate) continue;

    const monthsPassed = Math.floor((now - start_date) / msDays(90));
    const nextTO = start_date + (monthsPassed + 1) * msDays(90);
    const date = new Date(nextTO).toLocaleDateString().replace(/\//g, '.');
    message += `🔋 ${battery_name} — ${date}\n`;
  }

  message += '\nБот уведомит вас заранее, чтобы не забыть отметиться.';
  ctx.reply(message);
});
