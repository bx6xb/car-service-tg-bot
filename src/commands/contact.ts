import { Markup } from 'telegraf';
import { bot } from '../config';
import { batterySelectSteps, textState } from './state';
import { selectBatteryLastStep } from '../lib';

bot.on('contact', async (ctx) => {
  const userId = ctx.from?.id;
  const contact = ctx.message.contact;
  const phoneNumber = contact.phone_number;

  if (
    textState.get(userId) === 'select_battery' &&
    batterySelectSteps.get(userId)?.step === 'phone'
  ) {
    const batterySelectData = batterySelectSteps.get(userId);

    batterySelectSteps.set(userId, {
      ...batterySelectData,
      step: 'address',
      phone: phoneNumber,
    });

    if (batterySelectData?.delivery_method === 'delivery') {
      await ctx.reply('Введите адрес доставки', Markup.removeKeyboard());
    } else {
      selectBatteryLastStep(ctx);
    }
  }
});
