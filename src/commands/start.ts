import { Markup } from 'telegraf';
import { UserApi } from '../api';
import { bot } from '../config';
import { logError, notifyAdmins } from '../lib';

bot.start(async (ctx) => {
  await ctx.reply(
    '📋 Главное меню:',
    Markup.inlineKeyboard([
      [
        Markup.button.callback('🔋 Всё про АКБ', 'menu_akb'),
        Markup.button.callback('🎁 Акции и скидки', 'promotions'),
      ],
      [
        Markup.button.callback('📅 ТО и Гарантия', 'service'),
        Markup.button.callback('🛠 Частые вопросы', 'faq'),
      ],
      [Markup.button.callback('📞 Связаться с нами', 'menu_contact')],
    ]),
  );

  const { id, username } = ctx.from;

  try {
    await UserApi.addUser(id, username);
  } catch (e) {
    logError(e, 'Failed to add user');
    notifyAdmins(
      `❌ Не удалось добавить нового пользователя ${username ? `@${username} ` : ''}id ${id}`,
    );
  }
});
