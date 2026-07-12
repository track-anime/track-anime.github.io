# Track Anime — Business Logic

## Domain Key

```
Shikimori anime.id  ===  Kodik shikimori_id  ===  URL /anime/[shikimoriId]
```

Один Shikimori-тайтл может иметь несколько `KodikMaterial` (разные озвучки). Каждый material — отдельная запись с `translationId`, `translationTitle`, `playerLink`.

Для внешних интеграций, которым нужен MyAnimeList ID, используется отдельный mapping
`AnimeExternalIdMap`: `shikimoriId -> malId`. Этот mapping не заменяет основной доменный ключ сайта.
Заполнение запускается вручную из админки/CLI и автоматически в фоне для `shikimoriId`,
которые появились или обновились во время Kodik sync.

## Core Business Flows

### 1. Home Feed (новые серии)

**Источник:** `KodikEpisodeRelease` — создаётся при sync/import когда обнаружена новая серия.

**Flow:**
1. `getRecentReleasesPage()` — cursor pagination, sort by `releasedAt DESC`
2. Для авторизованных: `getHistoryNewEpisodes()` — серии из тайтлов в watch history, которых нет в основной ленте
3. `ReleaseFeed` (client) — infinite scroll через `GET /api/releases`
4. Фильтр по озвучкам из site settings пользователя

**Пустая лента:** нет данных → подсказка запустить `npm run kodik:sync`.

### 2. Anime Page + Player

**Flow:**
1. `getAnimePageData(shikimoriId)` загружает:
   - Shikimori metadata (title, description, score, relations)
   - Kodik translations из БД (все озвучки для shikimoriId)
   - Poster через цепочку fallback
2. Пользователь выбирает озвучку → `AnimeWatchPanel` загружает watch history
3. `KodikPlayer` встраивает iframe, слушает postMessage events
4. Прогресс сохраняется: season, episode, positionSeconds → `UserWatchProgress`
5. `AnimeWatchPanel` запрашивает OP/ED тайминги через `/api/anime/[shikimoriId]/skip-times` и показывает кнопки пропуска только когда текущая позиция находится внутри найденного интервала; пользователь может включить автопропуск OP/ED над плеером или в настройках плеера, а за 5 секунд до начала интервала появляется таймер автопропуска с отменой.
6. Тайминги AniSkip смещаются на intro-offset выбранной озвучки, чтобы учитывать локальные заставки студий до начала серии.
7. Админ видит рядом с плеером диагностический AniSkip-индикатор с источником, MAL ID, списком найденных интервалов для текущей серии и фоновым прогревом доступных серий тайтла.
8. Beta-плеер включается через пользовательскую настройку/переключатель над плеером с предупреждением о тестовом режиме.
9. Кнопка «Продолжить» показывается только когда видео не воспроизводится.
10. Beta-плеер использует собственный overlay UI; fullscreen-панель озвучек открывается колёсиком, стрелкой под таймлайном или мобильным свайпом снизу вверх и стыкуется с нижними контролами, перед списком серий появляется выбор реально доступных Kodik-сезонов текущей озвучки (включая названия вроде «Рекап»), если у неё доступно несколько сезонов, а озвучки с несколькими Kodik-сезонами помечаются в списке озвучек. Кнопка пропуска остаётся поверх видео даже при скрытой нижней панели, переходы на предыдущую/следующую серию находятся в нижней панели и системных Media Session кнопках, перемотка кнопками/стрелками показывает поверх видео суммируемый индикатор секунд, во время воспроизведения beta-плеер запрашивает Screen Wake Lock, при входе в fullscreen пытается включить landscape-ориентацию, видимость скрытой полосы прогресса настраивается пользователем и при 0% полоса выключается, `Shift` переключает между TA UI и родным интерфейсом Kodik с постоянной кнопкой возврата к TA UI, а `T` переключает обычный режим и режим по высоте страницы с учётом шапки и 16:9.

**Правило:** один прогресс на `(userId, shikimoriId)` — не на material/translation.

### 3. Authentication

**Flow:**
1. Login → `/api/auth/shikimori` → Shikimori OAuth
2. Callback → upsert `User` (по `shikimoriId`), save tokens в `ShikimoriAccount`
3. Admin: доступ определяется серверной настройкой или флагом пользователя
4. Session cookie `ta.session` → `Session` row, 30 дней

**OAuth state:** cookie + fallback `OAuthState` table (если cookies потерялись между редиректами).

### 4. Anime Lists (Shikimori sync)

**Local-first pattern:**
1. При входе / ручном sync: pull `user_rates` + `favourites` с Shikimori
2. Сохранение в `UserAnimeListEntry`, `UserAnimeBookmark`
3. Мутации на сайте: PUT `/api/user/anime-lists/[shikimoriId]` → обновление Shikimori API + локальный кэш
4. Метаданные sync в `UserListSync` (lastSyncedAt, errors)

**List statuses:** planned, watching, completed, on_hold, dropped, rewatching (Shikimori user_rates).

### 5. Watch History

**Модель:** `UserWatchProgress` — unique `(userId, shikimoriId)`.

**Поля:** `kodikId`, `seasonNumber`, `episodeNumber`, `positionSeconds`.

**Использование:**
- Страница `/history` — список с постерами
- Home block — новые серии из истории
- Anime page — восстановление позиции при открытии

### 6. Kodik Import

**Двухфазный импорт (`KodikImportJob`, id=`"full"`):**

| Phase | Action |
|-------|--------|
| `catalog` | Paginate Kodik `/list` (anime-serial, has shikimori_id) → save materials |
| `episodes` | For `episodesLoaded=false`: fetch with episodes → save seasons/episodes |

**Resume:** job state в БД, `--resume` flag в CLI.

### 7. Kodik Sync (incremental)

**Flow:**
1. Fetch N pages of recently updated materials (`KodikSyncSettings.syncPages`)
2. Update existing, add new materials
3. Detect new episodes → create `KodikEpisodeRelease`
4. Log run in `KodikSyncRun`
5. Auto-sync: `kodik-sync-scheduler.ts` по интервалу (`intervalMinutes`)

### 8. Search

**Источник:** локальная БД `KodikMaterial` (raw SQL в `search.ts`).

**Не ищет** напрямую в Shikimori/Kodik API — только по импортированным данным.

Быстрый поиск по названию сначала ранжирует точные и префиксные совпадения, затем добавляет неточные совпадения по локальным названиям тайтла. Подсказки в шапке отправляют запрос с задержкой после набора, чтобы не создавать лишние API-запросы; задержка хранится в `SearchSettings` и настраивается в админке.

### 9. Cover/Poster Resolution

**Цепочка fallback (`poster-fallback.ts`):**
1. Kodik materialData poster
2. Shikimori anime image (API + cache)
3. World-Art link parsing
4. Related anime poster
5. Placeholder

**Кэш:** `/api/cover` — resize через sharp, disk cache, настройки в `CoverCacheSettings`.

### 10. Notifications

**Flow:**
1. Пользователь настраивает каналы и шаблоны через `/api/user/notification-preferences` и link routes для browser push, Discord, Telegram, VK.
2. Глобальные настройки и тестовая отправка доступны админам через `/api/admin/notifications/*`.
3. Фоновая доставка выполняется `scripts/notification-worker.ts`.
4. In-app уведомления читаются через `/api/notifications/in-app`.

**Модели:** `UserNotificationPreferences`, `UserNotificationLink`, `NotificationDelivery`.

### 11. Brand Rotation

**Источник:** `.webp` файлы в `public/brand-logos`.

**Flow:**
1. Админ задаёт включение и интервал смены в `BrandRotationSettings`.
2. `getActiveBrandAsset()` выбирает один логотип детерминированно для текущего временного слота.
3. Кнопка «Сменить сейчас» в админке меняет `rotationSeed`, поэтому активный логотип обновляется без ожидания следующего интервала.
4. Шапка, metadata, PWA manifest, favicon/icon routes и push-уведомления используют активный логотип.
5. Если ротация выключена или папка пуста, используется `public/logo.webp`.

## Critical Logic Rules

| Rule | Detail |
|------|--------|
| Frontend isolation | Клиент не вызывает Shikimori/Kodik API напрямую |
| Material uniqueness | `KodikMaterial.kodikId` — primary key, one per translation |
| Episode uniqueness | `@@unique([materialId, seasonNumber, episodeNumber])` |
| Release uniqueness | `@@unique([materialId, seasonNumber, episodeNumber])` в releases |
| Session validation | Каждый protected route вызывает `getSession()` independently |
| Admin guard | `requireAdmin()` для pages, `requireAdminApi()` для API |
| Shikimori rate limit | Все Shikimori запросы через shared rate limiter |
| Token refresh | `auth-client.ts` auto-refresh при 401 |
| External anime IDs | `malId` хранится отдельно в `AnimeExternalIdMap`; основной ключ остается `shikimoriId` |
| Skip times | OP/ED интервалы берутся сервером из AniSkip и кэшируются в `AnimeEpisodeSkipTime` |
| Notifications | Доставка идёт сервером/worker, состояние каналов и ошибок хранится в Prisma |

## Edge Cases

- **Нет Kodik данных для shikimoriId:** anime page показывает Shikimori metadata, плеер недоступен
- **Несколько озвучек:** пользователь выбирает в `AnimeWatchPanel`, фильтр в site settings
- **ТВ-навигация:** локальная настройка устройства включает/выключает управление фокусом стрелками по сайту
- **Украшения аватарок:** настраиваются только авторизованными пользователями; гостям блок выбора в site settings скрыт
- **OAuth redirect mismatch:** `AUTH_URL` и `SHIKIMORI_REDIRECT_URI` должны совпадать с Shikimori app settings
- **Import interrupted:** resume через `npm run kodik:import:resume`
- **Пустая лента:** нужен первичный импорт каталога и последующая синхронизация

