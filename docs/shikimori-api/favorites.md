# Favorites — избранное

> Источник: [shikimori.one/api/doc/1.0/favorites](https://shikimori.one/api/doc/1.0/favorites)

Избранное на Shikimori — **отдельно от списков** (смотрю/просмотрено). Это закладки на аниме, мангу, персонажей и людей.

## POST /api/favorites/:linked_type/:linked_id(/:kind) — добавить

```bash
POST /api/favorites/Anime/12345
POST /api/favorites/Person/9/producer
```

| Параметр | Обязательный | Описание |
|----------|--------------|----------|
| `linked_type` | да | `Anime`, `Manga`, `Ranobe`, `Person`, `Character` |
| `linked_id` | да | ID сущности |
| `kind` | для Person | `common`, `seyu`, `mangaka`, `producer`, `person` |

### Ответ

```json
{
  "success": true,
  "notice": "Добавлено в избранное"
}
```

## DELETE /api/favorites/:linked_type/:linked_id — удалить

```bash
DELETE /api/favorites/Anime/12345
```

```json
{
  "success": true,
  "notice": "Удалено из избранного"
}
```

## POST /api/favorites/:id/reorder — изменить порядок

```bash
POST /api/favorites/9/reorder
{
  "new_index": "0"
}
```

## GET /api/users/:id/favourites — получить избранное

→ [users.md](./users.md)

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

## Избранное vs user_rates

| | Избранное (`favorites`) | Списки (`user_rates`) |
|---|------------------------|----------------------|
| Назначение | Закладки «нравится» | Статус просмотра |
| Статусы | Нет | watching, completed, ... |
| API | v1 favorites | **v2 user_rates** |
| На track-anime | Опционально | **Основное** |

## Связанные разделы

- [users.md](./users.md)
- [user_rates.md](./user_rates.md)
