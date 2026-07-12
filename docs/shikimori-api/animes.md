# Animes — каталог аниме

> Источник: [shikimori.one/api/doc/1.0/animes](https://shikimori.one/api/doc/1.0/animes)

## GET /api/animes — список аниме

### Фильтры через запятую

- `season=2016,2015` — аниме сезона 2016 **или** 2015
- `kind=tv,movie` — TV **или** Movie

### Режим исключения (`!`)

- `season=!2016,!2015` — без этих сезонов
- `kind=!tv,!movie` — без TV и Movie

### Комбинированный режим

- `season=2016,!summer_2016` — 2016 год, но без лета 2016

### Параметры

| Параметр | Описание |
|----------|----------|
| `page` | Страница |
| `limit` | Лимит (макс. **50**) |
| `order` | Сортировка: `id`, `ranked`, `kind`, `popularity`, `name`, `aired_on`, `episodes`, `status`, `random`, `updated_at`, ... |
| `kind` | `tv`, `movie`, `ova`, `ona`, `special`, `tv_13`, `tv_24`, `tv_48`, ... |
| `status` | `anons`, `ongoing`, `released` |
| `season` | `summer_2017`, `2016`, `2014_2016`, `199x` |
| `score` | Минимальный рейтинг |
| `duration` | `S` (<10 мин), `D` (<30 мин), `F` (>30 мин) |
| `rating` | `none`, `g`, `pg`, `pg_13`, `r`, `r_plus`, `rx` |
| `genre` | ID жанров через запятую |
| `genre_v2` | ID жанров v2 |
| `studio` | ID студий |
| `franchise` | Франшизы |
| `censored` | `false` — включая hentai/yaoi/yuri |
| `mylist` | Статус в **вашем** списке (требует auth) |
| `ids` | Список ID через запятую |
| `exclude_ids` | Исключить ID |
| `search` | Поиск по названию |

### Пример

```bash
GET /api/animes?search=Naruto&limit=10&order=popularity
```

### Краткий объект аниме (в списках)

```json
{
  "id": 56,
  "name": "Test",
  "russian": "аниме_56",
  "image": {
    "original": "/assets/globals/missing_original.jpg",
    "preview": "/assets/globals/missing_preview.jpg",
    "x96": "/assets/globals/missing_x96.jpg",
    "x48": "/assets/globals/missing_x48.jpg"
  },
  "url": "/animes/56-test",
  "kind": "tv",
  "score": "8.0",
  "status": "released",
  "episodes": 0,
  "episodes_aired": 0,
  "aired_on": "2014-01-01",
  "released_on": null
}
```

## GET /api/animes/:id — карточка аниме

Полная информация: описание, жанры, студии, рейтинги, `next_episode_at`, `user_rate` (если авторизован).

```bash
GET /api/animes/50
```

Ключевые поля:

| Поле | Описание |
|------|----------|
| `id` | ID Shikimori — **связь с Kodik** |
| `name` / `russian` | Названия |
| `score` | Рейтинг |
| `status` | `anons`, `ongoing`, `released` |
| `episodes` / `episodes_aired` | Эпизоды |
| `next_episode_at` | Следующая серия |
| `description` / `description_html` | Описание |
| `genres` / `studios` | Жанры, студии |
| `screenshots` | Скриншоты |
| `franchise` | Франшиза |
| `user_rate` | Запись в вашем списке (если auth) |

## Прочие эндпоинты

| Эндпоинт | Описание |
|----------|----------|
| `GET /api/animes/:id/roles` | Актёры, режиссёры, персонажи |
| `GET /api/animes/:id/similar` | Похожие |
| `GET /api/animes/:id/related` | Связанные (сиквелы, адаптации) |
| `GET /api/animes/:id/screenshots` | Скриншоты |
| `GET /api/animes/:id/franchise` | Граф франшизы |
| `GET /api/animes/:id/external_links` | Внешние ссылки (MAL, Wikipedia) |
| `GET /api/animes/:id/topics` | Топики/обсуждения |
| `GET /api/animes/search` | **DEPRECATED** — используйте `GET /api/animes?search=` |

## Связанные разделы

- [calendar.md](./calendar.md)
- [user_rates.md](./user_rates.md)
- [graphql.md](./graphql.md) — новые постеры
