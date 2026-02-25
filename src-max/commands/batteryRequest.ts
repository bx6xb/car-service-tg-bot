import { bot } from '../config';
import { getUserId } from '../lib';
import { requestSteps, textState } from './state';

bot.action('battery_request', async (ctx) => {
  await ctx.answerOnCallback({ notification: '' });
  const userId = getUserId(ctx);
  if (!userId) return;

  textState.set(userId, 'battery_request');
  requestSteps.set(userId, { step: 'car_brand' });
  await ctx.reply('Введите марку автомобиля');
});
