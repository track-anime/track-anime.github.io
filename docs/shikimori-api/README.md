# Shikimori API — документация

Локальная копия документации с [shikimori.one/api/doc](https://shikimori.one/api/doc).

## Оглавление

| Раздел | Файл | Статус |
|--------|------|--------|
| Обзор API | [overview.md](./overview.md) | ✅ |
| OAuth2 | [oauth.md](./oauth.md) | ✅ |
| Списки (user_rates v2) | [user_rates.md](./user_rates.md) | ✅ |
| Пользователи | [users.md](./users.md) | ✅ |
| Аниме | [animes.md](./animes.md) | ✅ |
| Календарь | [calendar.md](./calendar.md) | ✅ |
| Избранное | [favorites.md](./favorites.md) | ✅ |
| Друзья | [friends.md](./friends.md) | ✅ |
| GraphQL | [graphql.md](./graphql.md) | ✅ |
| Интеграция track-anime | [track-anime-integration.md](./track-anime-integration.md) | ✅ |

## Базовые сведения

- **Базовый URL:** `https://shikimori.one` (также `shikimori.io`)
- **API:** `/api/...` (v1), `/api/v2/...` (v2), `/api/graphql` (GraphQL)
- **Протокол:** только HTTPS
- **Авторизация:** OAuth2
- **Лимиты:** 5 запросов/сек, 90 запросов/мин
- **User-Agent:** обязателен — имя OAuth-приложения

## Версии API

| Версия | Статус | Когда использовать |
|--------|--------|-------------------|
| **GraphQL** | Рекомендуется | Новые постеры, гибкие запросы |
| **v2** | Актуальна для user_rates | CRUD списков аниме/манги |
| **v1** | Основная для каталога | Аниме, пользователи, календарь, друзья |
