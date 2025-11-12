import { Markup } from "telegraf";

export const mainMenu = () =>
  Markup.inlineKeyboard([
    [Markup.button.callback('♦️ Подбор аккумулятора', 'battery_request')],
    [
      Markup.button.callback('🔋 Всё про АКБ', 'menu_akb'),
      Markup.button.callback('🎁 Акции и скидки', 'promotions'),
    ],
    [
      Markup.button.callback('📅 ТО и Гарантия', 'service'),
      Markup.button.callback('🛠 Частые вопросы', 'faq'),
    ],
    [Markup.button.callback('📞 Связаться с нами', 'menu_contact')],
  ]);
