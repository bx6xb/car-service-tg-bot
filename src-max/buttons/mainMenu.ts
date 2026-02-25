import { Keyboard } from '@maxhub/max-bot-api';
import { Warranty } from '../api';

export const mainMenu = () =>
  Keyboard.inlineKeyboard([
    [Keyboard.button.callback('♦️ Подбор аккумулятора', 'battery_request')],
    [
      Keyboard.button.callback('🔋 Всё про АКБ', 'menu_akb'),
      Keyboard.button.callback('🎁 Акции и скидки', 'promotions'),
    ],
    [
      Keyboard.button.callback('📅 ТО и Гарантия', 'service'),
      Keyboard.button.callback('🛠 Частые вопросы', 'faq'),
    ],
    [Keyboard.button.callback('📞 Связаться с нами', 'menu_contact')],
  ]);

export type WarrantyAction = 'pause' | 'disable';

export const warrantiesMenu = (warranties: Warranty[], action: WarrantyAction) =>
  Keyboard.inlineKeyboard([
    ...warranties.map((w) => [
      Keyboard.button.callback(`🔋 ${w.battery_name}`, `warranty-${action}-${w.id}`),
    ]),
    [Keyboard.button.callback('↩️ Назад', 'warranty_toggle')],
  ]);
