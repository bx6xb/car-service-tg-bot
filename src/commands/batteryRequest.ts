import { Markup } from 'telegraf';
import { bot } from '../config';
import { requestSteps, textState } from './state';

bot.action('battery_request', async (ctx) => {
  await ctx.answerCbQuery();
  const userId = ctx.from?.id;

  textState.set(userId, 'battery_request');
  requestSteps.set(userId, { step: 'car_brand' });
  await ctx.reply('Введите марку автомобиля', Markup.removeKeyboard());
});
