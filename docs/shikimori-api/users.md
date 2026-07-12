# Users — пользователи

> Источник: [shikimori.one/api/doc/1.0/users](https://shikimori.one/api/doc/1.0/users)

## GET /api/users — список пользователей

| Параметр | Описание |
|----------|----------|
| `page` | Страница |
| `limit` | Лимит (макс. **100**) |
| `search` | Поиск по нику |

## GET /api/users/:id — профиль пользователя

Возвращает полный профиль: статистика списков, жанры, студии, `in_friends`, `stats.statuses` и т.д.

| Параметр | Описание |
|----------|----------|
| `is_nickname` | `1` — искать по nickname вместо ID |

```bash
GET /api/users/TestUser?is_nickname=1
```

## GET /api/users/:id/info — краткая информация

```json
{
  "id": 23456815,
  "nickname": "Test",
  "avatar": "/assets/globals/missing_avatar/x48.png",
  "name": null,
  "sex": null,
  "website": null,
  "birth_on": null,
  "full_years": null,
  "locale": "ru"
}
```

## GET /api/users/whoami — текущий пользователь

Требует **Authorization: Bearer TOKEN**.

Используется после OAuth для получения ID и nickname авторизованного пользователя.

```bash
GET /api/users/whoami
Authorization: Bearer ACCESS_TOKEN
```

## POST /api/users/sign_out — выход

```bash
POST /api/users/sign_out
```

## GET /api/users/:id/friends — друзья

| Параметр | Описание |
|----------|----------|
| `page` | Страница |
| `limit` | Лимит (макс. **100**) |

```json
[
  {
    "id": 23456802,
    "nickname": "user_7",
    "avatar": "/assets/globals/missing_avatar/x48.png",
    "last_online_at": "2022-11-26T17:19:30.832+03:00",
    "url": "http://test.host/user_7"
  }
]
```

→ Управление друзьями: [friends.md](./friends.md)

## GET /api/users/:id/anime_rates — список аниме пользователя

Аналог v2 user_rates, но **с вложенным объектом `anime`**.

| Параметр | Описание |
|----------|----------|
| `page` | Страница |
| `limit` | Лимит (макс. **5000**) |
| `status` | `planned`, `watching`, `rewatching`, `completed`, `on_hold`, `dropped` |
| `censored` | `true` — скрыть hentai/yaoi/yuri |

```bash
GET /api/users/12345/anime_rates?status=watching&limit=100
```

## GET /api/users/:id/manga_rates — список манги

Аналогично `anime_rates`, но с объектом `manga`.

## GET /api/users/:id/favourites — избранное

```json
{
  "animes": [],
  "mangas": [],
  "ranobe": [],
  "characters": [],
  "people": [],
  "mangakas": [],
  "seyu": [],
  "producers": []
}
```

→ Добавление/удаление: [favorites.md](./favorites.md)

## GET /api/users/:id/history — история

История действий пользователя (просмотры, изменения списков).

| Параметр | Описание |
|----------|----------|
| `page` | Страница |
| `limit` | Лимит |

## Прочие эндпоинты

| Эндпоинт | Описание | Scope |
|----------|----------|-------|
| `GET /api/users/:id/clubs` | Клубы пользователя | — |
| `GET /api/users/:id/messages` | Личные сообщения | `messages` |
| `GET /api/users/:id/unread_messages` | Непрочитанные | `messages` |
| `GET /api/users/:id/bans` | Баны | — |

## Аватары

Поле `image` содержит размеры: `x160`, `x148`, `x80`, `x64`, `x48`, `x32`, `x16`.

Полный URL: `https://shikimori.one` + путь из `avatar` или `image.x48`.

## Связанные разделы

- [oauth.md](./oauth.md)
- [user_rates.md](./user_rates.md)
- [friends.md](./friends.md)
- [favorites.md](./favorites.md)
