# Car Service Bot — «Ампер»

Два бота для автосервиса аккумуляторов «Ампер» (Таганрог):

- **Telegram-бот** (`src/`) — уведомления о ТО, информация об АКБ, акции, контакты
- **Max-бот** (`src-max/`) — всё то же самое + полноценная форма подбора аккумулятора

Клиенты, купившие аккумулятор с расширенной гарантией, получают напоминания посетить сервис каждые ~3 месяца. Администраторы управляют гарантиями, рассылками и пользователями прямо через бот.

---

## Требования

- Node.js 22+
- pnpm 10+
- Два Supabase-проекта (для Telegram и Max ботов)
- Токены ботов: Telegram и Max

---

## Установка

```bash
git clone https://github.com/bx6xb/car-service-tg-bot
cd car-service-tg-bot
pnpm i
```

Создайте файл `.env` на основе `.env.example`:

```env
# Telegram бот
SUPABASE_URL=https://...
SUPABASE_KEY=your_supabase_anon_key
BOT_TOKEN=your_telegram_bot_token
ADMIN_IDS=123456789,987654321
API_URL=https://your-api-domain.ru

# Max бот
MAX_BOT_TOKEN=your_max_bot_token
MAX_SUPABASE_URL=https://...
MAX_SUPABASE_KEY=your_max_supabase_anon_key
MAX_ADMIN_IDS=123456789,987654321
```

> `ADMIN_IDS` и `MAX_ADMIN_IDS` — ID пользователей через запятую, без пробелов.

---

## Запуск

### Режим разработки

```bash
pnpm dev        # Telegram бот
pnpm dev:max    # Max бот
```

### Продакшн

```bash
pnpm build          # Сборка обоих ботов
pnpm start          # Telegram: dist/bot.js
pnpm start:max      # Max: dist/max-bot.js
```

Для автозапуска Telegram-бота через PM2:

```bash
pm2 start ecosystem.config.js
```

---

## Скрипты

| Скрипт | Описание |
|--------|----------|
| `pnpm dev` | Telegram бот в dev-режиме (nodemon + ts-node) |
| `pnpm dev:max` | Max бот в dev-режиме |
| `pnpm build` | Сборка обоих ботов (esbuild, минификация) |
| `pnpm build:tg` | Сборка только Telegram-бота |
| `pnpm build:max` | Сборка только Max-бота |
| `pnpm start` | Запуск собранного Telegram-бота |
| `pnpm start:max` | Запуск собранного Max-бота |
| `pnpm format` | Форматирование кода (Prettier) |
| `pnpm dep` | Проверка циклических зависимостей (madge) |
| `pnpm types` | Проверка типов без компиляции |

---

## Структура проекта

```
├── src/                    # Telegram бот (Telegraf)
│   ├── api/                # Запросы к Supabase + API продуктов
│   ├── buttons/            # Inline-клавиатуры
│   ├── commands/           # Обработчики команд и callback-ов
│   ├── config/             # Конфиг, переменные окружения, бот, Supabase
│   ├── jobs/               # Cron-задачи (рассылки, напоминания)
│   ├── lib/                # Утилитные функции
│   ├── middlewares/        # Admin-guard, сброс состояния
│   ├── services/           # Бизнес-логика и работа с БД
│   ├── text/               # Тексты для пользователей (HTML)
│   └── index.ts            # Точка входа
├── src-max/                # Max бот (та же структура)
├── .env.example            # Шаблон переменных окружения
├── build.ts                # Скрипт сборки (esbuild)
├── ecosystem.config.js     # Конфиг PM2
├── nodemon.json            # Конфиг nodemon для dev
├── package.json
├── tsconfig.json
└── AGENTS.md               # Документация для AI-агентов
```

---

## Функциональность

### Для пользователей

| Кнопка | Что делает |
|--------|-----------|
| ♦️ Подбор аккумулятора | Форма подбора АКБ по марке/модели авто (Max) или ссылка на сайт (TG) |
| 🔋 Всё про АКБ | 12 статей: неисправности, зарядка, хранение и т.д. |
| 🎁 Акции и скидки | Актуальные акции |
| 📅 ТО и Гарантия | Дата следующего ТО, управление напоминаниями |
| 🛠 Частые вопросы | FAQ |
| 📞 Связаться с нами | Адрес, телефон, менеджер |

**Напоминания о ТО** — цикл 90 дней. Бот отправляет уведомления за 20 и за 10 дней до следующего ТО. Пользователь может приостановить напоминания или отключить их полностью.

### Для администраторов

| Команда | Описание |
|---------|----------|
| `/w <название АКБ> <18\|24\|36\|48>` | Создать гарантию на аккумулятор |
| `/nb` | Создать новую рассылку (текст → дата → время) |
| `/b` | Список рассылок; ответить номером — удалить |
| `/u` | Количество пользователей |

Рассылки отправляются в 09:00 или 17:00 МСК.

---

## Стек технологий

| Технология | Назначение |
|-----------|-----------|
| Node.js 22 | Среда выполнения |
| TypeScript 5.8 | Язык (strict mode, CommonJS) |
| Telegraf 4.x | Telegram Bot API |
| @maxhub/max-bot-api | Max Bot API |
| Supabase | База данных (PostgreSQL) |
| axios | HTTP-клиент для API продуктов |
| node-cron | Планировщик задач |
| esbuild | Сборка и минификация |
| dotenv | Переменные окружения |
| pnpm | Менеджер пакетов |
| Prettier | Форматирование кода |
| PM2 | Process manager (продакшн) |
