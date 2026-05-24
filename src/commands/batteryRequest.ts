import { Markup } from 'telegraf';
import { bot } from '../config';
import { editMessageText } from '../lib';

// === СТАРАЯ ЛОГИКА (подбор через Telegram-бота) ===
// Раскомментировать и удалить новый блок ниже, если возвращаемся к подбору внутри бота.
//
// import { requestSteps, textState } from './state';
//
// bot.action('battery_request', async (ctx) => {
//   await ctx.answerCbQuery();
//   const userId = ctx.from?.id;
//   textState.set(userId, 'battery_request');
//   requestSteps.set(userId, { step: 'car_brand' });
//   await ctx.reply('Введите марку автомобиля', Markup.removeKeyboard());
// });
// === КОНЕЦ СТАРОЙ ЛОГИКИ ===

bot.action('battery_request', async (ctx) => {
  await ctx.answerCbQuery();

  await editMessageText(
    ctx,
    '🔋 <b>Подбор аккумулятора</b>\n\nПодбор аккумуляторов теперь осуществляется через бота в мессенджере <b>Max</b> или через наш <b>сайт</b>.\n\nВыберите удобный способ 👇',
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.url('📱 Бот в Max', 'https://max.ru/id615426315675_bot')],
        [Markup.button.url('🌐 Сайт ampercenter.ru', 'https://ampercenter.ru/')],
        [Markup.button.callback('↩️ Назад', 'menu_main')],
      ]),
    },
  );
});
