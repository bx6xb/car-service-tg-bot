import { WarrantyApi } from '../api';
import { bot } from '../config';
import { goBackMenu, msDays } from '../lib';

bot.action('warranty_next_to', async (ctx) => {
  await ctx.answerCbQuery();
  const userId = ctx.from.id;
  const warranties = await WarrantyApi.getUserWarranties(userId);

  if (warranties.length === 0)
    return await ctx.editMessageText('У вас нет активных гарантий.', goBackMenu('service'));

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
  await ctx.editMessageText(message, goBackMenu('service'));
});
