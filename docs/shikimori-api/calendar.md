# Calendar — расписание выхода серий

> Источник: [shikimori.one/api/doc/1.0/calendars](https://shikimori.one/api/doc/1.0/calendars)

## GET /api/calendar — календарь аниме

Возвращает список ongoing/anons аниме с датой выхода **следующей серии**.

```bash
GET /api/calendar
```

| Параметр | Описание |
|----------|----------|
| `censored` | `false` — включая hentai/yaoi/yuri (по умолчанию скрыты) |

### Пример ответа

```json
[
  {
    "next_episode": 1,
    "next_episode_at": "2016-09-04T09:00:00.000+03:00",
    "duration": null,
    "anime": {
      "id": 20,
      "name": "anime_20",
      "russian": "аниме_20",
      "image": { "x96": "...", "x48": "..." },
      "url": "/animes/20-anime-20",
      "kind": "tv",
      "score": "1.0",
      "status": "ongoing",
      "episodes": 0,
      "episodes_aired": 0,
      "aired_on": "2016-09-04",
      "released_on": null
    }
  }
]
```

### Поля записи

| Поле | Описание |
|------|----------|
| `next_episode` | Номер следующей серии |
| `next_episode_at` | Дата/время выхода (ISO 8601, MSK +03:00) |
| `duration` | Длительность серии (минуты) или `null` |
| `anime` | Объект аниме |

## Применение на track-anime

Календарь по дням недели (Пн–Вс) можно построить:

1. Запросить `GET /api/calendar`
2. Сгруппировать по `next_episode_at` → день недели
3. Кэшировать в PostgreSQL (TTL ~1 час)

### Альтернатива: Kodik API

Kodik тоже даёт `next_episode_at` через `with_material_data=true` в `/list`.

| Источник | Плюсы |
|----------|-------|
| **Shikimori** `/api/calendar` | Официальное расписание, без Kodik-токена |
| **Kodik** `/list` | + ссылки на плеер, озвучки |

Рекомендация: **Shikimori для расписания**, **Kodik для плеера** — связка через `anime.id` = `shikimori_id`.

## Связанные разделы

- [animes.md](./animes.md)
- [../kodik-api/list.md](../kodik-api/list.md)
- [track-anime-integration.md](./track-anime-integration.md)
