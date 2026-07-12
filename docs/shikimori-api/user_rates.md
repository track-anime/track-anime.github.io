# User Rates (v2) — списки аниме/манги

> Источник: [shikimori.one/api/doc/2.0/user_rates](https://shikimori.one/api/doc/2.0/user_rates)

Основной API для списков пользователя: **смотрю**, **просмотрено**, **запланировано**, **брошено**, **отложено**, **пересматриваю**.

> v1 `/api/user_rates` — **DEPRECATED**. Используйте v2.

## Базовый URL

```
https://shikimori.one/api/v2/user_rates
```

Запись/изменение/удаление требует OAuth scope **`user_rates`**.

## Статусы

| status | На сайте track-anime |
|--------|---------------------|
| `planned` | Запланировано |
| `watching` | Смотрю |
| `rewatching` | Пересматриваю |
| `completed` | Просмотрено |
| `on_hold` | Отложено |
| `dropped` | Брошено |

## GET /api/v2/user_rates — список записей

### Параметры

| Параметр | Обязательный | Описание |
|----------|--------------|----------|
| `user_id` | нет | ID пользователя |
| `target_id` | нет | ID аниме/манги |
| `target_type` | нет | `Anime` или `Manga` |
| `status` | нет | Фильтр по статусу |
| `page` | нет | Страница |
| `limit` | нет | Лимит (макс. **1000** при `user_id`, иначе до 100000) |

> `page` и `limit` **игнорируются**, если указан `user_id`.

### Пример

```bash
GET /api/v2/user_rates?user_id=12345&target_type=Anime&status=watching
```

### Ответ

```json
[
  {
    "id": 13,
    "user_id": 23456789,
    "target_id": 12,
    "target_type": "Anime",
    "score": 0,
    "status": "completed",
    "rewatches": 0,
    "episodes": 0,
    "volumes": 0,
    "chapters": 0,
    "text": null,
    "text_html": "",
    "created_at": "2022-11-26T17:19:28.708+03:00",
    "updated_at": "2022-11-26T17:19:28.708+03:00"
  }
]
```

## GET /api/v2/user_rates/:id — одна запись

```bash
GET /api/v2/user_rates/9
```

## POST /api/v2/user_rates — создать

**Scope:** `user_rates`

```json
POST /api/v2/user_rates
{
  "user_rate": {
    "user_id": "23456789",
    "target_id": "15",
    "target_type": "Anime",
    "status": "watching",
    "score": "10",
    "episodes": "2",
    "volumes": "3",
    "chapters": "4",
    "rewatches": "5",
    "text": "test"
  }
}
```

| Поле | Обязательное | Описание |
|------|--------------|----------|
| `user_rate[user_id]` | да | ID пользователя |
| `user_rate[target_id]` | да | ID аниме/манги |
| `user_rate[target_type]` | да | `Anime` или `Manga` |
| `user_rate[status]` | нет | Статус |
| `user_rate[score]` | нет | Оценка 0–10 |
| `user_rate[episodes]` | нет | Просмотрено эпизодов |
| `user_rate[volumes]` | нет | Прочитано томов |
| `user_rate[chapters]` | нет | Прочитано глав |
| `user_rate[rewatches]` | нет | Количество пересмотров |
| `user_rate[text]` | нет | Текстовый комментарий |

Ответ: `201` + объект user_rate.

## PATCH/PUT /api/v2/user_rates/:id — обновить

**Scope:** `user_rates`

```json
PATCH /api/v2/user_rates/12
{
  "user_rate": {
    "status": "watching",
    "score": "10",
    "episodes": "2",
    "text": "test"
  }
}
```

Поля `target_id` и `target_type` при update не меняются.

## POST /api/v2/user_rates/:id/increment — +1 эпизод/глава

**Scope:** `user_rates`

```bash
POST /api/v2/user_rates/11/increment
{}
```

Увеличивает `episodes` (для аниме) или `chapters` (для манги) на 1.

## DELETE /api/v2/user_rates/:id — удалить

**Scope:** `user_rates`

```bash
DELETE /api/v2/user_rates/10
```

Ответ: `204`.

## Структура user_rate

| Поле | Описание |
|------|----------|
| `id` | ID записи в Shikimori (нужен для sync) |
| `user_id` | ID пользователя |
| `target_id` | ID аниме/манги |
| `target_type` | `Anime` / `Manga` |
| `score` | Оценка (0 = нет оценки) |
| `status` | Статус в списке |
| `episodes` | Просмотрено эпизодов |
| `rewatches` | Пересмотры |
| `text` | Комментарий (plain) |
| `text_html` | Комментарий (HTML) |
| `created_at` | Дата создания |
| `updated_at` | **Ключ для sync** — last-write-wins |

## Альтернатива v1: списки с вложенным anime

```bash
GET /api/users/:id/anime_rates?status=watching&page=1&limit=50
```

Возвращает записи **с объектом `anime`** внутри — удобно для отображения, но для записи используйте **v2**.

→ [users.md](./users.md)

## Связанные разделы

- [oauth.md](./oauth.md)
- [users.md](./users.md)
- [track-anime-integration.md](./track-anime-integration.md)
