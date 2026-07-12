# Интеграция Shikimori + Kodik для track-anime

Сводная таблица: какие API использовать для каждой функции сайта.

## Архитектура

```
Фронтенд → Ваш Next.js API → PostgreSQL
                           ↘ Shikimori (sync, фон)
                           ↘ Kodik (кэш, фон)
```

**Фронтенд не ходит напрямую** ни в Shikimori, ни в Kodik.

## Функции сайта

| Функция | Shikimori | Kodik | Локальная БД |
|---------|-----------|-------|--------------|
| **Авторизация** | OAuth2 | — | User + tokens |
| **Списки (смотрю/...)** | v2 `/api/v2/user_rates` | — | UserAnimeRate + sync |
| **Профиль** | `/api/users/:id`, `whoami` | — | Кэш профиля |
| **Друзья** | `/api/friends`, `/api/users/:id/friends` | — | Friendship + sync |
| **Избранное** | `/api/favorites/...` | — | Опционально локально |
| **Календарь** | `/api/calendar` | `/list?anime_status=ongoing` | CalendarEntry |
| **Карточка аниме** | `/api/animes/:id` | `/search?shikimori_id=` | AnimeCache |
| **Плеер** | — | `/search?shikimori_id=&with_episodes=true` | KodikMaterial |
| **Прогресс просмотра** | PATCH user_rates | Kodik Player API events | Sync queue |

## Ключ связи

```
Shikimori anime.id  ===  Kodik shikimori_id
```

## Sync Shikimori (local-first)

### При входе

1. OAuth → сохранить tokens
2. `GET /api/v2/user_rates?user_id=ME&limit=1000` → import в БД
3. `GET /api/users/whoami` → профиль

### При изменении на сайте

1. Запись в PostgreSQL (`syncStatus: pending_push`)
2. Ответ пользователю сразу
3. Фон: POST/PATCH/DELETE `/api/v2/user_rates`

### Периодический pull

```
GET /api/v2/user_rates?user_id=ME
```

Сравнение по `updated_at` → last-write-wins.

## Эндпоинты по страницам

### Главная — календарь

```bash
# Shikimori
GET /api/calendar

# или Kodik (с плеером)
GET /list?types=anime-serial&anime_status=ongoing&with_material_data=true
```

### Страница аниме

```bash
# Метаданные + ваш статус
GET /api/animes/:id                    # + user_rate если auth
GET /api/v2/user_rates?target_id=:id # статус в списке

# Плеер
GET /search?shikimori_id=:id&with_episodes=true&with_material_data=true
```

### Профиль пользователя

```bash
GET /api/users/:id
GET /api/users/:id/anime_rates?status=watching
GET /api/users/:id/friends
```

## Rate limits (оба API)

| API | RPS | RPM |
|-----|-----|-----|
| Shikimori | 5 | 90 |
| Kodik | 5 | 90 |

Один воркер с очередью на сервере.

## OAuth scopes для track-anime

```
user_rates+friends
```

## Связанные документы

### Shikimori
- [oauth.md](./oauth.md)
- [user_rates.md](./user_rates.md)
- [calendar.md](./calendar.md)

### Kodik
- [../kodik-api/search.md](../kodik-api/search.md)
- [../kodik-api/list.md](../kodik-api/list.md)
- [../kodik-api/player-api.md](../kodik-api/player-api.md)
