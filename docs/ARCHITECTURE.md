# Track Anime — Architecture

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│  Presentation (src/app, src/components)                 │
│  Server Components (pages) + Client Components (UI)   │
├─────────────────────────────────────────────────────────┤
│  API Layer (src/app/api/*)                              │
│  Route handlers, auth guards, JSON responses            │
├─────────────────────────────────────────────────────────┤
│  Domain / Services (src/lib/*, src/kodik/*)             │
│  Business logic, external API clients, caching          │
├─────────────────────────────────────────────────────────┤
│  Data Access (src/lib/prisma.ts, src/db/*)              │
│  Prisma ORM, raw SQL where needed                       │
├─────────────────────────────────────────────────────────┤
│  PostgreSQL (prisma/schema.prisma)                      │
└─────────────────────────────────────────────────────────┘
```

## App Flow

### Request lifecycle (typical page)

1. `src/app/**/page.tsx` (Server Component) вызывает `getSession()` и lib-функции
2. Lib загружает данные из PostgreSQL и/или внешних API (Shikimori, Kodik)
3. DTO сериализуется и передаётся в client components как props
4. Client components делают `fetch("/api/...")` для мутаций (списки, прогресс, настройки)

### Auth flow

```
GET /api/auth/shikimori
  → save OAuth state (cookie + OAuthState table)
  → redirect to Shikimori authorize

GET /api/auth/callback/shikimori?code=&state=
  → validate state
  → exchange code for tokens
  → GET /api/users/whoami
  → upsert User + ShikimoriAccount
  → create Session, set ta.session cookie
```

`src/proxy.ts` используется только для канонизации legacy host и редиректа legacy
`?shikimori_id=` → `/anime/{id}`. Auth проверяется per-route через `getSession()` /
`requireAdmin()`.

### Kodik data pipeline

```
Kodik API (/list, /search)
  → src/kodik/client.ts (rate-limited HTTP)
  → src/db/save-material.ts (upsert KodikMaterial, seasons, episodes, releases)
  → PostgreSQL

Import: scripts/kodik-import-full.ts
  Phase 1 (catalog): paginate list, save materials without episodes
  Phase 2 (episodes): fetch with_episodes_data, save episodes

Sync: src/lib/admin/kodik-sync.ts
  Fetch N recent pages → update materials → detect new episode releases
  → KodikEpisodeRelease for home feed
```

### Player flow

```
getAnimePageData(shikimoriId)
  → Kodik translations from DB
  → Shikimori metadata (cached)

AnimeWatchPanel (client)
  → KodikPlayer iframe (playerLink)
  → postMessage: kodik_player_time_update, kodik_player_current_episode
  → PUT /api/user/watch-history/[shikimoriId]
```

## Integrations

| Service | Client module | Auth | Rate limit |
|---------|---------------|------|------------|
| Shikimori public API | `src/lib/shikimori/client.ts` | None | `rate-limiter.ts` |
| Shikimori GraphQL | `src/lib/shikimori/mal-id.ts` via `client.ts` | None | `rate-limiter.ts` |
| Shikimori user API | `src/lib/shikimori/auth-client.ts` | OAuth tokens per user | Shared limiter |
| Shikimori OAuth | `src/lib/auth/shikimori-oauth.ts` | Client ID/secret | — |
| AniSkip API | `src/lib/aniskip.ts` | None | cache in DB |
| Kodik API | `src/kodik/client.ts` | API token | `src/kodik/rate-limiter.ts` |
| Kodik player | iframe + `src/lib/kodik-player-api.ts` | — | — |
| Browser push | `src/lib/notifications/*` | VAPID keys | worker dispatch |
| Discord/Telegram/VK notifications | `src/lib/notifications/channels/*` | User channel links | worker dispatch |

Shikimori host (`shikimori.io` / `shikimori.one`) настраивается в `ShikimoriSettings` (админка).

## Important Services

### Session (`src/lib/auth/session.ts`)

- Cookie `ta.session` → `Session` row в БД
- TTL 30 дней
- `getSession()` — основная точка проверки auth

### Prisma (`src/lib/prisma.ts`)

- Singleton с dev global reuse
- Schema: `prisma/schema.prisma`

### Cover cache (`src/lib/cover-cache.ts`)

- `GET /api/cover` — прокси и кэш обложек (sharp resize)
- Настройки в `CoverCacheSettings`

### Brand rotation (`src/lib/brand-rotation.ts`)

- WEBP-логотипы читаются из `public/brand-logos`
- Активный логотип выбирается детерминированно на временной слот из `BrandRotationSettings`
- `/api/brand/logo`, `/api/brand/icon`, `/api/brand/favicon` отдают текущее лого, PNG-иконки и favicon для шапки, metadata, manifest и уведомлений

### Shikimori anime cache (`src/lib/shikimori/anime-cache.ts`)

- JSON-кэш метаданных аниме в БД
- TTL + background refresh

### Shikimori MAL ID mapping (`src/lib/shikimori/mal-id.ts`)

- Серверный mapping `shikimoriId -> malId` для интеграций, которым нужен MyAnimeList ID
- Источник: Shikimori GraphQL `animes { id malId }`
- Кэш в `AnimeExternalIdMap`, включая `null`, чтобы не повторять бесполезные запросы
- Админский refresh: `src/lib/admin/mal-id-sync.ts` + `/api/admin/shikimori/mal-id-sync`
- Kodik sync фоном дозаполняет mapping для новых/обновленных `shikimoriId`

### AniSkip skip-times (`src/lib/aniskip.ts`)

- Сервер получает OP/ED интервалы по `malId + episodeNumber + episodeLength`
- Клиент вызывает только `/api/anime/[shikimoriId]/skip-times`
- Найденные интервалы кэшируются в `AnimeEpisodeSkipTime`
- Обычный Kodik player показывает кнопки пропуска и делает `seek` на `endTime`

### Favorites sync (`src/lib/favorites-sync.ts`)

- Pull user_rates и favourites с Shikimori → `UserAnimeListEntry`, `UserAnimeBookmark`
- Метаданные в `UserListSync`

### Releases feed (`src/lib/releases.ts`)

- Cursor pagination по `KodikEpisodeRelease`
- Фильтр по translation (site settings)

### Notifications (`src/lib/notifications/*`)

- Preferences хранятся в `UserNotificationPreferences`
- Внешние привязки каналов — `UserNotificationLink`
- События доставки и ошибки — `NotificationDelivery`
- API routes обслуживают browser push subscription, in-app ленту и Discord/Telegram/VK link/unlink
- Фоновая отправка — `scripts/notification-worker.ts`

## Admin Subsystem

`src/app/admin/*` + `src/app/api/admin/*` + `src/lib/admin/*`

- Kodik import/sync management
- Auto-sync scheduler (`kodik-sync-scheduler.ts`)
- DB explorer, user management, todos
- Cover cache and Shikimori host settings
- Search settings (`SearchSettings`) for header search debounce
- Notification settings, test delivery, VAPID generation
- Site defaults, watch-history settings, translation intro offsets

## Caching Strategy

| Data | Strategy |
|------|----------|
| Anime page | `revalidate = 3600` |
| Home feed | `revalidate = 300` |
| Shikimori anime | DB cache + `unstable_cache` |
| Posters | Disk cache via `/api/cover` |
| Search | No cache (live DB query) |
