import { Context } from '@maxhub/max-bot-api';
import { batterySelectSteps, textState } from '../commands/state';
import { notifyAdmins } from './notifyAdmins';
import { BatteryRequestService } from '../services/BatteryRequestService';

export const selectBatteryLastStep = async (ctx: Context, address?: string) => {
  const userId = ctx.user!.user_id;
  const batterySelectData = batterySelectSteps.get(userId);

  batterySelectSteps.set(userId, {
    ...batterySelectData,
    step: 'address',
    ...(address && { address }),
  });

  const requestData = batterySelectSteps.get(userId);

  const { data, error } = await BatteryRequestService.complete(
    requestData!.id!,
    requestData!.phone!,
    requestData!.battery!,
    requestData?.address,
  );

  textState.delete(userId);
  batterySelectSteps.delete(userId);

  if (error || !data) {
    return await ctx.reply('Произошла ошибка при обновлении заявки, попробуйте ещё раз');
  }

  notifyAdmins(`Клиент указал данные для заявки #${requestData?.id}`);

  if (data.delivery_method === 'delivery') {
    await ctx.reply(
      `Готово! ⚙️\nМенеджер Ян уже оформил доставку вашего аккумулятора\n\n📦 В ближайшее время мы свяжемся с вами для финального подтверждения и удобного времени доставки.\n\n☎️ Если нужно уточнить детали — звоните: <b>8-989-722-80-95</b>\n\nСпасибо, что выбрали <b>Ампер</b> ⚡️`,
      { format: 'html' },
    );
    return;
  }

  await ctx.reply(
    `Готово ✅\n\nВыбранный аккумулятор ждет вас в нашем центре по адресу: Мариупольское шоссе, 1.\nМы работаем с 8:30 до 18:30, без выходных.\n\nhttps://yandex.ru/maps/org/akkumulyatorny_tsentr_amper/207765729717?si=8q3wq9uajefgvt1z531f8ey7cw`,
  );
};
