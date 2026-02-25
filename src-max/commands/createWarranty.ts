import { bot } from '../config';
import { getUserId } from '../lib';
import { textState, createWarrantySteps } from './state';

bot.command('w', async (ctx) => {
  const userId = getUserId(ctx);
  if (!userId) return;

  const commandMid = ctx.messageId;

  const prompt = await ctx.reply(
    'Введите название аккумулятора и срок гарантии через пробел\n<i>Пример: аккумулятор для гелика 24</i>',
    { format: 'html' },
  );

  textState.set(userId, 'create_warranty');
  createWarrantySteps.set(userId, {
    promptMid: prompt.body.mid,
    commandMid: commandMid ?? '',
  });
});
