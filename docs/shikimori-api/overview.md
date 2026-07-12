# Shikimori API — обзор

> Источник: [shikimori.one/api/doc](https://shikimori.one/api/doc)

## Welcome to Shikimori API

API имеет три версии: **GraphQL**, **v2** и **v1**. По возможности предпочитайте **GraphQL** вместо v2/v1.

> **Не парсите основной сайт.** Получайте все данные через API.

> **Новые постеры** аниме/манги/персонажей доступны **только в GraphQL API**.

## Базовый URL

```
https://shikimori.one/api/...
https://shikimori.io/api/...   # альтернативный домен
```

Работает **только HTTPS**.

## Документация по версиям

| Версия | Ссылка | Локальный файл |
|--------|--------|----------------|
| GraphQL | [shikimori.one/api/doc/graphql](https://shikimori.one/api/doc/graphql) | [graphql.md](./graphql.md) |
| v1 | [shikimori.one/api/doc/1.0](https://shikimori.one/api/doc/1.0) | animes, users, calendar... |
| v2 | [shikimori.one/api/doc/2.0](https://shikimori.one/api/doc/2.0) | [user_rates.md](./user_rates.md) |

## Аутентификация

Используется **OAuth2**. Все остальные методы авторизации устарели (deprecated с 2018-07-01).

→ Подробнее: [oauth.md](./oauth.md)

## Ограничения

| Лимит | Значение |
|-------|----------|
| RPS | **5** запросов в секунду |
| RPM | **90** запросов в минуту |

## Требования к запросам

1. **User-Agent** — обязательно указывать **имя OAuth-приложения**
2. **Не имитировать браузер** — иначе IP может быть забанен
3. **Authorization: Bearer TOKEN** — для защищённых эндпоинтов

```http
GET /api/users/whoami HTTP/1.1
Host: shikimori.one
User-Agent: TrackAnime
Authorization: Bearer ACCESS_TOKEN
```

## Пагинация

При запросе `N` элементов из пагинированного API в большинстве случаев вернётся **`N+1`** результат, если есть следующая страница (признак наличия next page).

Параметры: `page`, `limit` (максимум зависит от эндпоинта).

## Полный индекс v1 API

| Раздел | Эндпоинты | Документация |
|--------|-----------|--------------|
| Achievements | `/api/achievements` | [official](https://shikimori.one/api/doc/1.0/achievements) |
| Animes | `/api/animes`, `/api/animes/:id`, ... | [animes.md](./animes.md) |
| Calendars | `/api/calendar` | [calendar.md](./calendar.md) |
| Characters | `/api/characters/:id`, `/search` | [official](https://shikimori.one/api/doc/1.0/characters) |
| Clubs | `/api/clubs`, ... | [official](https://shikimori.one/api/doc/1.0/clubs) |
| Comments | `/api/comments`, ... | [official](https://shikimori.one/api/doc/1.0/comments) |
| Favorites | `/api/favorites/...` | [favorites.md](./favorites.md) |
| Friends | `/api/friends/:id` | [friends.md](./friends.md) |
| Genres | `/api/genres` | [official](https://shikimori.one/api/doc/1.0/genres) |
| Mangas | `/api/mangas`, ... | [official](https://shikimori.one/api/doc/1.0/mangas) |
| Messages | `/api/messages`, ... | [official](https://shikimori.one/api/doc/1.0/messages) |
| People | `/api/people/:id`, `/search` | [official](https://shikimori.one/api/doc/1.0/people) |
| Reviews | `/api/reviews`, ... | [official](https://shikimori.one/api/doc/1.0/reviews) |
| Studios | `/api/studios` | [official](https://shikimori.one/api/doc/1.0/studios) |
| Topics | `/api/topics`, ... | [official](https://shikimori.one/api/doc/1.0/topics) |
| User rates (v1) | `/api/user_rates` | DEPRECATED → используйте v2 |
| Users | `/api/users`, ... | [users.md](./users.md) |

## v2 API

| Раздел | Эндпоинты |
|--------|-----------|
| User rates | `/api/v2/user_rates` → [user_rates.md](./user_rates.md) |
| Topic ignore | `/api/v2/topics/:id/ignore` |
| User ignore | `/api/v2/users/:id/ignore` |
| Abuse requests | `/api/v2/abuse_requests/...` |
| Episode notifications | `/api/v2/episode_notifications` |

## Сторонние реализации

- Python: [OlegWock/shikimori-api](https://github.com/OlegWock/shikimori-api)
- Node.js: [Capster/shikimori-api-v2](https://github.com/Capster/shikimori-api-v2)
- C#: JustRoxy
- Ruby: iwdt

## Обратная связь

@morr, email (см. официальный сайт)
