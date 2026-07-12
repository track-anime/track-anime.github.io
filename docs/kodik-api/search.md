# `/search` — поиск материалов

> Источник: [bd.kodikres.com/api/info/search](https://bd.kodikres.com/api/info/search)

## Описание

Возвращает список наиболее подходящих поисковому запросу материалов. Наиболее релевантные — первыми.

Результаты **автоматически сортируются по последней серии и сезону** — по умолчанию показывается озвучка с самой свежей серией. Логику можно изменить параметрами приоритизации озвучек.

По умолчанию повышенный приоритет у озвучек **«Дублированный»** и **«Проф. Многоголосый»** — это можно отключить через `prioritize_translations=0`.

## Endpoint

```
GET|POST https://kodik-api.com/search
```

## Обязательные параметры

| Название | Описание |
|----------|----------|
| `token` | API-токен |

**Плюс хотя бы один** из параметров поиска (см. ниже).

## Параметры поиска

> Обязателен **минимум один** из этих параметров.

| Название | По умолчанию | Описание |
|----------|--------------|----------|
| `title` | — | Название. Нечёткий поиск по: `title`, `title_orig`, `other_title`, `anime_title`, `title_en`, `anime_license_name`, `other_titles`, `other_titles_en`, `other_titles_jp` |
| `title_orig` | — | Оригинальное название. Поиск только по `title_orig`. Допускаются лишние слова |
| `strict` | `false` | При `true` — только материалы с **тем же порядком слов** (лишние слова в запросе допускаются). Работает с `title` / `title_orig` |
| `full_match` | `false` | При `true` — **полное совпадение** названия (без лишних слов, тот же порядок и символы; регистр не важен). С `title` — совпадение хотя бы с одним названием |
| `id` | — | Kodik ID: `movie-123123` / `serial-123123` |
| `player_link` | — | Поиск по ссылке на плеер |
| `kinopoisk_id` | — | ID КиноПоиска (`0` – `999999999`) |
| `imdb_id` | — | ID IMDb (`tt0` – `tt999999999`) |
| `mdl_id` | — | ID MyDramaList (`123456` / `123456-title`) |
| `worldart_animation_id` | — | ID World Art (раздел аниме) |
| `worldart_cinema_id` | — | ID World Art (раздел кино) |
| `worldart_link` | — | Полная ссылка World Art |
| `shikimori_id` | — | ID Shikimori (`0` – `999999999`) — **основной способ связи с вашим сайтом** |

### Поиск по нескольким ID

Если передать несколько ID (кроме Kodik `id`), вернутся материалы с **хотя бы одним** совпадением. Сортировка — по количеству совпавших ID (больше совпадений — выше).

## Необязательные параметры — общие

| Название | По умолчанию | Доступные значения | Описание |
|----------|--------------|--------------------|----------|
| `limit` | — | `1` – `100` | Максимальное количество результатов |
| `types` | Все типы | См. [`/list`](./list.md) | Фильтр по типу материала |
| `year` | — | `1982`, `1982,2020` | Фильтр по году |
| `translation_id` | — | `714`, `714,720` | Фильтр по ID озвучки |
| `translation_type` | — | `voice`, `subtitles` | Только голос / субтитры |
| `has_field` | — | `kinopoisk_id`, `imdb_id`, `mdl_id`, `worldart_link`, `shikimori_id` | Материалы с **хотя бы одним** полем. Для **всех** — `has_field_and` |
| `prioritize_translations` | `704,734` | ID через запятую, `subtitles`, `voice`, `0` | Повышение приоритета озвучек. Чем левее ID — тем выше. `0` — отключить стандартную приоритизацию |
| `unprioritize_translations` | `800,882,subtitles` | ID через запятую, `subtitles`, `voice`, `0` | Понижение приоритета. Чем левее — тем ниже. `0` — отключить стандартную |
| `prioritize_translation_type` | `voice` | `voice`, `subtitles` | Сначала голосовые или субтитры |
| `block_translations` | — | `714`, `714,720` | Исключить озвучки |
| `camrip` | — | `true`, `false` | `false` — только качественная картинка |
| `lgbt` | — | `true`, `false` | `false` — без LGBT-сцен |
| `with_seasons` | `false` | `true`, `false` | Добавить поле `seasons` |
| `season` | — | `1`, `5` | Только сериалы с указанным сезоном. Автоматически включает `with_seasons` |
| `with_episodes` | `false` | `true`, `false` | Сезоны + ссылки на серии |
| `with_episodes_data` | `false` | `true`, `false` | Сезоны + объекты серий (`link`, `title`, `screenshots`) |
| `episode` | — | `1`, `5` | Конкретный эпизод сезона. **Требует `season`**. Автоматически включает `with_episodes` |
| `with_page_links` | `false` | `true`, `false` | Ссылки на страницы Kodik вместо прямых ссылок плеера |
| `not_blocked_in` | — | `RU`, `RU,UA` | Не заблокировано в указанных странах |
| `not_blocked_for_me` | — | `true`, `false` | Kodik определяет страну запроса и скрывает заблокированное |
| `with_material_data` | `false` | `true`, `false` | Добавить `material_data` |

### Приоритизация озвучек (по умолчанию)

| Параметр | Стандартное значение | Эффект |
|----------|---------------------|--------|
| `prioritize_translations` | `704,734` | Повышен: «Дублированный», «Проф. Многоголосый» |
| `unprioritize_translations` | `800,882,subtitles` | Понижены: «Украинский», «English», все субтитры |
| `prioritize_translation_type` | `voice` | Сначала голосовые озвучки |

Для аниме-сайта с Anilibria и др.:

```
prioritize_translations=0&prioritize_translations=ANILIBRIA_ID,OTHER_ID
```

### Фильтрация по метаданным

Те же параметры, что у [`/list`](./list.md): `countries`, `genres`, `anime_genres`, `duration`, рейтинги, персоны, `anime_status`, `anime_studios` и др.

## Структура ответа

| Поле | Описание |
|------|----------|
| `time` | Время выполнения запроса |
| `total` | Количество найденных материалов |
| `results` | Массив материалов |

Структура каждого материала в `results` — **идентична [`/list`](./list.md)**:

`id`, `title`, `title_orig`, `other_title`, `link`, `year`, `shikimori_id`, `translation`, `last_season`, `last_episode`, `episodes_count`, `seasons`, `material_data`, `screenshots` и др.

→ Поля `material_data`: [material_data.md](./material_data.md)

> В отличие от `/list`, **нет пагинации** (`next_page` / `prev_page`) — только `limit`.

## Примеры запросов

### Поиск по названию

```
GET https://kodik-api.com/search?token=YOUR_TOKEN&title=Аватар
```

### Поиск по Shikimori ID (для страницы аниме)

```
GET https://kodik-api.com/search?token=YOUR_TOKEN&shikimori_id=12345&with_episodes=true&with_material_data=true
```

### Конкретная серия для плеера

```
GET https://kodik-api.com/search?token=YOUR_TOKEN&shikimori_id=12345&season=1&episode=5&with_episodes=true
```

### Поиск с приоритетом нужной озвучки

```
GET https://kodik-api.com/search?token=YOUR_TOKEN&shikimori_id=12345&prioritize_translations=0&prioritize_translations=704,611
```

## Пример ответа (поиск по названию)

```json
{
  "time": "5ms",
  "total": 27,
  "results": [
    {
      "id": "movie-452654",
      "type": "foreign-movie",
      "link": "http://kodikplayer.com/video/93/.../720p",
      "title": "Аватар",
      "title_orig": "Avatar",
      "translation": {
        "id": 704,
        "title": "Дублированный",
        "type": "voice"
      },
      "year": 2009,
      "kinopoisk_id": "251733",
      "imdb_id": "tt0499549",
      "quality": "BDRip 720p",
      "blocked_countries": [],
      "created_at": "2014-06-22T22:19:22Z",
      "updated_at": "2016-04-25T07:03:33Z",
      "screenshots": [
        "https://i.kodikres.com/screenshots/video/50811/1.jpg"
      ]
    }
  ]
}
```

## Пример ответа (по kinopoisk_id с сериями)

```json
{
  "time": "5ms",
  "total": 9,
  "results": [
    {
      "id": "serial-452654",
      "type": "anime-serial",
      "link": "http://kodikplayer.com/serial/4309/.../720p",
      "title": "Игра престолов",
      "title_orig": "Game of Thrones",
      "translation": {
        "id": 611,
        "title": "ColdFilm",
        "type": "voice"
      },
      "year": 2011,
      "last_season": 9,
      "last_episode": 4,
      "episodes_count": 119,
      "kinopoisk_id": "1161904",
      "seasons": {
        "5": {
          "link": "http://kodikplayer.com/season/27856/.../720p",
          "episodes": {
            "1": "http://kodikplayer.com/seria/119601/.../720p",
            "2": "http://kodikplayer.com/seria/203940/.../720p"
          }
        }
      },
      "material_data": {
        "title": "Игра престолов",
        "title_en": "Game of Thrones",
        "year": 2011,
        "description": "...",
        "poster_url": "https://st.kp.yandex.net/...",
        "kinopoisk_rating": 9,
        "genres": ["фэнтези", "боевик", "драма"]
      }
    }
  ]
}
```

## Применение на вашем сайте

| Задача | Запрос |
|--------|--------|
| **Найти плеер по Shikimori** | `shikimori_id=...&with_episodes=true` |
| **Конкретная серия** | `shikimori_id=...&season=1&episode=5&with_episodes=true` |
| **Поиск на сайте** | `title=...&types=anime-serial&limit=20` |
| **Выбор озвучки** | `prioritize_translations` с ID нужных студий |
| **Карточка аниме** | `shikimori_id=...&with_material_data=true` |

## `/search` vs `/list`

| | `/search` | `/list` |
|---|-----------|---------|
| Назначение | Найти конкретный материал | Массовая выборка / парсинг |
| Пагинация | Нет (`limit` только) | Да (`next_page`) |
| Сортировка | По релевантности + последняя серия | Настраиваемая (`sort`, `order`) |
| Календарь | Не подходит | `anime_status=ongoing` + `with_material_data` |
| Страница аниме | `shikimori_id=...` | — |

## Связанные разделы

- [`/list`](./list.md)
- [material_data — структура метаданных](./material_data.md)
- [`/translations/v2`](./translations.md)
- [Обзор API](./overview.md)
