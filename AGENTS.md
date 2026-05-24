# AGENTS.md — AI Agent Guide

This file is the primary reference for AI coding agents working on this project. Read it fully before making any changes.

---

## Project Summary

**«Ампер»** — car battery service center in Taganrog, Russia.

This repo contains **two bots** running as separate processes:

| Bot | Directory | Framework | Messenger |
|-----|-----------|-----------|-----------|
| TG bot | `src/` | Telegraf 4.x | Telegram |
| Max bot | `src-max/` | @maxhub/max-bot-api 0.2 | Max (VK) |

Both bots are functionally equivalent with the following exception: **battery selection wizard** runs only in Max bot; the TG bot redirects users to Max bot and `ampercenter.ru`.

---

## File Structure

Both `src/` and `src-max/` mirror the same internal layout:

```
src/
├── index.ts                  # Bootstrap: imports config, middlewares, commands, jobs
├── api/                      # Supabase queries + axios product API
│   ├── user.ts
│   ├── warranty.ts
│   ├── broadcast.ts
│   ├── messages.ts
│   ├── request.ts            # battery_requests table
│   └── products.ts           # GET /api/products
├── buttons/
│   └── mainMenu.ts           # Inline keyboard builders
├── commands/
│   ├── start.ts              # /start — upsert user, show menu
│   ├── menu.ts               # Main menu + all action callbacks
│   ├── batteryRequest.ts     # Battery: redirect (TG) / wizard steps (Max)
│   ├── createWarranty.ts     # Admin /w — create warranty record
│   ├── newBroadcast.ts       # Admin /nb — schedule broadcast
│   ├── broadcasts.ts         # Admin /b — list & delete broadcasts
│   ├── users.ts              # Admin /u — user count
│   ├── nextTO.ts             # Inline: show next ТО date
│   ├── toggleWarranty.ts     # Inline: pause/resume reminders
│   ├── contact.ts            # TG only: bot.on('contact')
│   ├── message.ts            # State machine for multi-step flows
│   ├── callbackQuery.ts      # Callback/action dispatcher
│   └── state.ts              # In-memory user state { [userId]: { step, data } }
├── config/
│   ├── bot.ts                # Bot instance, setMyCommands, launch
│   ├── variables.ts          # Parse process.env, export typed constants
│   ├── checkEnvVars.ts       # Throws if any required var is missing at startup
│   ├── supabase.ts           # Supabase client(s)
│   └── api.ts                # Axios instance with baseURL = API_URL
├── jobs/
│   ├── index.ts              # Register cron jobs (06:00 + 14:00 daily)
│   ├── sendBroadcasts.ts     # Send due broadcasts, store message IDs
│   └── sendWarranties.ts     # Send 10-day and 20-day ТО reminders
├── lib/                      # Pure utility functions
│   ├── logError.ts
│   ├── formatDate.ts
│   ├── msDays.ts             # n => n * 86_400_000
│   ├── escapeMarkdownV2.ts
│   ├── sendTempMessage.ts    # Send + auto-delete after N ms
│   ├── notifyAdmins.ts       # Send alert to admin IDs
│   ├── goBackMenu.ts
│   ├── editMessageText.ts
│   ├── cleanupOldMessages.ts
│   ├── pinMessage.ts
│   ├── request.ts            # Generic fetch helper
│   ├── selectBatteryLastStep.ts
│   ├── showStart.ts
│   └── createImagePath.ts
├── middlewares/
│   ├── admin.ts              # Block non-admins from admin commands
│   └── clearState.ts         # Reset state[userId] on any /command
├── services/                 # All business logic + DB calls
│   ├── UserService.ts
│   ├── WarrantyService.ts
│   ├── BroadcastService.ts
│   └── BatteryRequestService.ts
└── text/
    └── index.ts              # All user-facing HTML strings (akbReplies, contactReplies)
```

`src-max/` differences from `src/`:
- No `commands/contact.ts` — contact handled in `message_created` via `ctx.contactInfo`
- Extra `lib/getUserId.ts` — resolves user ID from various Max update shapes
- `config/supabase.ts` exports two clients: `supabase` (Max DB) + `tgSupabase` (TG DB)

---

## Environment Variables

```env
# Telegram bot
SUPABASE_URL=          # Supabase project URL for TG bot
SUPABASE_KEY=          # Supabase anon key for TG bot
BOT_TOKEN=             # Telegram bot token
ADMIN_IDS=             # Comma-separated Telegram user IDs with admin access
API_URL=               # Base URL for product/image API (Laravel backend)

# Max bot
MAX_BOT_TOKEN=         # Max (VK) bot token
MAX_SUPABASE_URL=      # Supabase project URL for Max bot
MAX_SUPABASE_KEY=      # Supabase anon key for Max bot
MAX_ADMIN_IDS=         # Comma-separated Max user IDs with admin access
```

Both bots need `API_URL`. TG bot also reads `MAX_BOT_TOKEN` + `MAX_ADMIN_IDS` to send admin notifications into Max.

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 22 | Runtime |
| TypeScript | 5.8 | Language (strict, CommonJS) |
| Telegraf | 4.16 | Telegram bot framework |
| @maxhub/max-bot-api | 0.2 | Max messenger bot framework |
| @supabase/ssr | latest | Database client |
| axios | latest | HTTP client for product API |
| node-cron | latest | Cron scheduler |
| dotenv | latest | Env var loading |
| esbuild | latest | Bundler (minified, node22 target) |
| pnpm | 10.10 | Package manager |
| ts-node | latest | Dev runtime |
| nodemon | latest | Dev file watcher |
| prettier | latest | Code formatter |

---

## npm Scripts

| Script | What it does |
|--------|-------------|
| `pnpm dev` | Run TG bot in dev mode (nodemon + ts-node) |
| `pnpm dev:max` | Run Max bot in dev mode |
| `pnpm build` | Bundle both bots with esbuild |
| `pnpm build:tg` | Bundle TG bot only |
| `pnpm build:max` | Bundle Max bot only |
| `pnpm start` | Run compiled `dist/bot.js` |
| `pnpm start:max` | Run compiled `dist/max-bot.js` |
| `pnpm format` | Run Prettier |
| `pnpm dep` | Check for circular dependencies (madge) |
| `pnpm types` | Type-check without emit (`tsc --noEmit`) |

---

## Database Tables

### `users`
| Column | Type | Notes |
|--------|------|-------|
| user_id | bigint | Telegram/Max user ID |
| username | text | |

### `warranty_reminders`
| Column | Type | Notes |
|--------|------|-------|
| user_id | bigint | |
| battery_name | text | |
| start_date | date | Purchase / warranty start |
| duration | int | Months: 18, 24, 36, or 48 |
| next_service_date | date | Computed next ТО date |
| paused | bool | Skip next reminder cycle |

### `broadcasts`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | |
| text | text | HTML message body |
| date | date | Scheduled send date |
| time | text | `'09:00'` or `'17:00'` |
| sent | bool | |

### `bot_messages`
| Column | Type | Notes |
|--------|------|-------|
| message_id | bigint | |
| chat_id | bigint | |
| broadcast_id | uuid | FK to broadcasts |

### `battery_requests`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | |
| user_id | bigint | |
| brand | text | Car brand |
| model | text | Car model |
| engine | text | Engine type |
| year | int | Year |
| delivery | bool | Delivery or pickup |
| phone | text | |
| status | text | `'new'`, `'in_progress'`, `'done'` |
| source | text | `'tg'` \| `'max'` \| `'website'` |

---

## Architectural Conventions

### 1. Service layer is mandatory for DB access

All Supabase queries must be in `services/`. Commands call services only.

```typescript
// ✅ correct
const user = await UserService.upsert(userId, username);

// ❌ wrong — DB in command handler
const { data } = await supabase.from('users').select('*');
```

### 2. Barrel imports

Always import from directory index files:

```typescript
import { logError, notifyAdmins } from '../lib';   // ✅
import { logError } from '../lib/logError';         // ❌
```

### 3. Text content in text/index.ts

No inline HTML strings in commands. Add to `text/index.ts` and import.

### 4. Env vars from config/variables.ts

```typescript
import { BOT_TOKEN, ADMIN_IDS } from './variables'; // ✅
process.env.BOT_TOKEN                               // ❌
```

### 5. Error handling

```typescript
try {
  ...
} catch (err) {
  logError(err, 'context label');
  await notifyAdmins(`❌ Error message: ${String(err)}`);
}
```

### 6. Mirror edits

When modifying `src/`, check if `src-max/` needs the same change and vice versa. The bots are mirrors; business logic changes usually apply to both.

### 7. State machine

Multi-step flows (battery wizard, broadcast creation, warranty creation in Max) use `state.ts`:

```typescript
state[userId] = { step: 'awaiting_brand' };
// In message handler:
if (state[userId]?.step === 'awaiting_brand') { ... }
```

---

## Main Menu Buttons

| Button | Callback data | Available in |
|--------|---------------|-------------|
| ♦️ Подбор аккумулятора | `battery_request` | TG (redirect) + Max (wizard) |
| 🔋 Всё про АКБ | `menu_akb` | Both |
| 🎁 Акции и скидки | `promotions` | Both |
| 📅 ТО и Гарантия | `service` | Both |
| 🛠 Частые вопросы | `faq` | Both |
| 📞 Связаться с нами | `menu_contact` | Both |

---

## Admin Commands

| Command | Access | Behavior |
|---------|--------|---------|
| `/w <battery> <months>` | Admin | Creates warranty; months: 18, 24, 36, or 48 |
| `/nb` | Admin | Multi-step: text → date → time → saved |
| `/b` | Admin | Lists broadcasts; reply with number to delete |
| `/u` | Admin | Replies with user count, auto-deletes after 3s |

---

## Cron Jobs

Both bots run at `0 6 * * *` and `0 14 * * *` (server time):
1. Clean up old broadcast messages (`bot_messages` table)
2. Send any due broadcasts to all users
3. Send warranty ТО reminders (10-day and 20-day alerts)

---

## Known Constraints

- `nodemon.json` only watches `src/` — for Max bot dev use `pnpm dev:max` (ts-node directly)
- PM2 `ecosystem.config.js` only configures the TG bot — start Max bot separately
- `tsconfig.json` includes `commitlint.config.ts` which does not exist in the repo — ignore that warning
- ESLint and Husky are not present despite being mentioned in old docs
