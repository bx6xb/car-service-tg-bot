import { Markup } from 'telegraf';
import { bot } from '../config';
import { akbReplies, contactReplies } from '../text';
import { editMessageText, goBackMenu } from '../lib';
import { mainMenu } from './start';

bot.command('menu', async (ctx) => {
  await ctx.reply('📋 Главное меню:', mainMenu());
});

bot.action('menu_main', async (ctx) => {
  await ctx.answerCbQuery();
  await editMessageText(ctx, '📋 Главное меню:', mainMenu());
});

bot.action('menu_akb', async (ctx) => {
  await ctx.answerCbQuery();
  await editMessageText(
    ctx,
    '🔋 Всё про АКБ:',
    Markup.inlineKeyboard([
      [
        Markup.button.callback('🔧 Неисправности', 'faults'),
        Markup.button.callback('📋 Правила эксплуатации', 'rules'),
      ],
      [
        Markup.button.callback('🔍 Проверка состояния', 'check'),
        Markup.button.callback('⚡️ Зарядка', 'charging'),
      ],
      [
        Markup.button.callback('🔄 Замена', 'replacement'),
        Markup.button.callback('❄️☀️ Температура', 'temperature'),
      ],
      [
        Markup.button.callback('🔌 Нагрузки', 'load'),
        Markup.button.callback('✅ Качество', 'quality'),
      ],
      [
        Markup.button.callback('⚙️ Совместимость', 'compatibility'),
        Markup.button.callback('🌡️ Подготовка', 'season'),
      ],
      [
        Markup.button.callback('📦 Хранение', 'storage'),
        Markup.button.callback('⚖️ Сравнение', 'compare'),
      ],
      [Markup.button.callback('↩️ Назад', 'menu_main')],
    ]),
  );
});

bot.action('menu_contact', async (ctx) => {
  await ctx.answerCbQuery();
  await editMessageText(
    ctx,
    '📞 Связаться с нами:',
    Markup.inlineKeyboard([
      [Markup.button.callback('📍 Адрес магазина', 'contact_address')],
      [Markup.button.callback('📞 Позвонить', 'contact_call')],
      [Markup.button.callback('💬 Написать менеджеру', 'contact_chat')],
      [Markup.button.callback('↩️ Назад', 'menu_main')],
    ]),
  );
});

for (const [key, message] of Object.entries(akbReplies)) {
  bot.action(key, async (ctx) => {
    await ctx.answerCbQuery();
    await editMessageText(ctx, message, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('↩️ Назад', 'menu_akb')],
        [Markup.button.callback('🏠 Главное меню', 'menu_main')],
      ]),
    });
  });
}

for (const [key, message] of Object.entries(contactReplies)) {
  bot.action(key, async (ctx) => {
    await ctx.answerCbQuery();
    await editMessageText(ctx, message, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('↩️ Назад', 'menu_contact')],
        [Markup.button.callback('🏠 Главное меню', 'menu_main')],
      ]),
    });
  });
}

bot.action('promotions', async (ctx) => {
  await ctx.answerCbQuery();
  await editMessageText(
    ctx,
    `<b>🎁 Акции и скидки</b>

<b>1) 🪫 Сдай старый АКБ — получи скидку на новый!</b>
Сдайте старые аккумуляторы и получите скидку на новые!
Принимаем отработанные АКБ по честным ценам.
За аккумулятором — в Аккумуляторный центр <b>АМПЕР</b>!

<b>2) 🔌 Бесплатная забота о твоём АКБ</b>
Купил аккумулятор у нас?
Значит, обслуживание — за наш счёт:
— Проверим АКБ бесплатно  
— При необходимости подзарядим  
— Предоставим подменный АКБ при необходимости  
📍 Таганрог, Мариупольское шоссе, 1

<b>3) ♻️ Повышенный тариф утилизации</b>
Обновлённый тариф на сдачу старых АКБ:
— При покупке нового АКБ BATHOFF или ВЛАДАР  
— Вы получаете повышенный тариф на сдачу старого  
♻️ Это:
— Выгодно  
— Экологично  
— Удобно  

📌 Подробнее — <a href="https://t.me/yanamper">связаться с админом</a>`,
    {
      parse_mode: 'HTML',
      ...goBackMenu('menu_main'),
    },
  );
});

bot.action('service', async (ctx) => {
  await ctx.answerCbQuery();

  editMessageText(
    ctx,
    `📅 <b>ТО и Гарантия</b>
Покупал АКБ с расширенной гарантией? Тогда не забывай приезжать на ТО! Всё просто — напоминания приходят заранее.`,
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('📆 Когда следующее ТО?', 'warranty_next_to')],
        [Markup.button.callback('🛡️ Как работает расширенная гарантия', 'warranty_how')],
        [Markup.button.callback('📌 Что будет, если пропустить', 'warranty_skip')],
        [Markup.button.callback('🔔 Отключить/включить напоминания', 'warranty_toggle')],
        [Markup.button.callback('📃 Условия и детали гарантии', 'warranty_details')],
        [Markup.button.callback('↩️ Назад', 'menu_main')],
      ]),
    },
  );
});

// bot.action('warranty_next_to', async (ctx) => {
//   await ctx.answerCbQuery();
//   await editMessageText(ctx,
//     '📆 <b>Когда следующее ТО?</b>\n\n' +
//       'Если ты указывал дату покупки, мы напомним тебе за несколько дней до следующего ТО.\n\n' +
//       'ТО проводится раз в 3 месяца с момента покупки.',
//     {
//       parse_mode: 'HTML',
//       ...goBackMenu('service'),
//     },
//   );
// });

bot.action('warranty_how', async (ctx) => {
  await ctx.answerCbQuery();
  await editMessageText(
    ctx,
    '🛡️ <b>Как работает расширенная гарантия?</b>\n\n' +
      'Расширенная гарантия действует только при соблюдении условия — регулярное прохождение ТО каждые 3 месяца.\n' +
      'При каждом ТО мы делаем отметку, и гарантия продолжается.',
    {
      parse_mode: 'HTML',
      ...goBackMenu('service'),
    },
  );
});

bot.action('warranty_skip', async (ctx) => {
  await ctx.answerCbQuery();
  await editMessageText(
    ctx,
    '📌 <b>Что будет, если пропустить ТО?</b>\n\n' +
      `Если вы не приедете на ТО в указанный срок (например, спустя 3 месяца после покупки), расширенная гарантия аннулируется. В этом случае останется только базовая гарантия —  1 год.

📉 Риск выхода из строя без замены по гарантии спустя год.
Даже если аккумулятор выйдет из строя по вине завода-изготовителя, при пропущенном ТО вам могут отказать в замене.

⚠️ Не выявленные проблемы
ТО позволяет выявить мелкие неисправности и предотвратить серьёзные. Без диагностики можно упустить начало сульфатации, проблемы с клеммами или нестабильную работу генератора.


🧠 Вывод
Проще заехать на 5 минут, чем потом спорить по гарантии или покупать новый аккумулятор.

📍 ТО бесплатно, и без записи.
 Адрес: г. Таганрог, Мариупольское шоссе, 1
📞 8-989-722-80-95 — позвоните и мы ответим на любой вопрос.`,
    {
      parse_mode: 'HTML',
      ...goBackMenu('service'),
    },
  );
});

// bot.action('warranty_toggle', async (ctx) => {
//   await ctx.answerCbQuery();
//   await editMessageText(ctx,
//     '🔔 <b>Отключить/включить напоминания</b>\n\n' +
//       'Скоро здесь появится возможность управлять напоминаниями. Пока что они включены по умолчанию.',
//     {
//       parse_mode: 'HTML',
//       ...goBackMenu('service'),
//     },
//   );
// });

bot.action('warranty_details', async (ctx) => {
  await ctx.answerCbQuery();
  await editMessageText(
    ctx,
    '🔧 <b>Расширенная гарантия — что это такое?</b>\n\n' +
      `Дополнительная гарантия — это как усиленная броня для вашего аккумулятора. Она может продлить срок гарантии до 3-4 лет, но действует на особых условиях.

🛠 Чтобы сохранить расширенную гарантию, нужно:
✔️ Приезжать к нам на бесплатное ТО каждые 3 месяца с момента покупки.
✔️ Мы проверим аккумулятор, генератор, состояние клемм и сделаем отметку в гарантийном талоне.

📌 Важно знать:
Если вы пропускаете ТО, расширенная гарантия прекращает своё действие.
❗️ Но базовая гарантия (1 год) остаётся в любом случае — она не зависит от ТО.

💬 <b>Не хотите потерять расширенную гарантию?
Амперыч напомнит заранее, когда пора на ТО!</b>📅`,
    {
      parse_mode: 'HTML',
      ...goBackMenu('service'),
    },
  );
});

bot.action('faq', async (ctx) => {
  await ctx.answerCbQuery();
  await editMessageText(
    ctx,
    `📌 <b>Часто задаваемые вопросы</b>

❓ <b>1. Сколько должен служить аккумулятор?</b>
Средний срок службы АКБ — от 4 до 5 лет или около 60–80 тыс. км пробега.
Но всё зависит от условий эксплуатации и качества аккумулятора.

❓ <b>2. На что обратить внимание при покупке?</b>
Дата производства — не должен быть старше 12 месяцев.
Целостность корпуса и клемм.
Уточните: подойдёт ли аккумулятор к вашему авто. (размеры, полярность)

❓ <b>3. Нужно ли заряжать новый АКБ?</b>
Если аккумулятор свежий (менее 6–12 месяцев), подзарядка не обязательна.
Но небольшая дозарядка всегда будет полезной.

❓ <b>4. Выдаёте чек и гарантийный талон?</b>
Обязательно! Мы всегда даём:
🧾 Чек
🛡️ Гарантийный талон
Сохраняйте их на весь срок гарантии.

❓ <b>5. Что входит в гарантию?</b>
📌 Заводской брак:
— короткое замыкание банки
— обрыв цепи

⛔️ Не входит:
— глубокий разряд
— механические повреждения
— осыпание активной массы (неправильная эксплуатация)`,
    {
      parse_mode: 'HTML',
      ...goBackMenu('menu_main'),
    },
  );
});
