import { Context } from 'telegraf';
import { batterySelectSteps, textState } from '../commands/state';
import { supabase } from '../config';
import { notifyAdmins } from './notifyAdmins';
import { escapeMarkdownV2 } from './escapeMarkdownV2';
import { Request } from '../api';

export const selectBatteryLastStep = async (ctx: Context, address?: string) => {
  const userId = ctx.from!.id!;
  const batterySelectData = batterySelectSteps.get(userId);

  batterySelectSteps.set(userId, {
    ...batterySelectData,
    step: 'address',
    ...(address && {
      address,
    }),
  });

  const requestData = batterySelectSteps.get(userId);

  const { data, error } = await supabase
    .from('battery_requests')
    .update({
      phone: requestData?.phone,
      selected_battery: requestData?.battery?.split('\n\n').slice(0, 2).join('\n\n'),
      ...(requestData?.address && {
        address: requestData?.address,
      }),
    })
    .eq('id', requestData?.id)
    .select()
    .single<Request>();

  textState.delete(userId);
  batterySelectSteps.delete(userId);

  if (error) {
    return await ctx.reply('Произошла ошибка при обновлении заявки, попробуйте ещё раз', {
      reply_markup: {
        remove_keyboard: true,
      },
    });
  }

  notifyAdmins(`Клиент указал данные для заявки #${requestData?.id}`);

  if (data.delivery_method === 'delivery') {
    await ctx.reply(
      escapeMarkdownV2(`Готово! ⚙️
Менеджер Ян уже оформил доставку вашего аккумулятора 

📦 В ближайшее время мы свяжемся с вами для финального подтверждения и удобного времени доставки.

☎️ Если нужно уточнить детали — звоните: *8\\-989\\-722\\-80\\-95*

Спасибо, что выбрали *Ампер* ⚡️`),
      {
        parse_mode: 'MarkdownV2',
        reply_markup: {
          remove_keyboard: true,
        },
      },
    );
    return;
  }

  await ctx.reply(
    `Готово ✅ 

Выбранный аккумулятор ждет вас в нашем центре по адресу: Мариупольское шоссе, 1.
Мы работаем с 8:30 до 18:30, без выходных.

https://yandex.ru/maps/org/akkumulyatorny_tsentr_amper/207765729717?si=8q3wq9uajefgvt1z531f8ey7cw`,
    {
      reply_markup: {
        remove_keyboard: true,
      },
    },
  );
};
