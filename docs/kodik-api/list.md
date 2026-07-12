# `/list` — список материалов

> Источник: [bd.kodikres.com/api/info/list](https://bd.kodikres.com/api/info/list)

## Описание

Возвращает список всех материалов, подходящих под критерии запроса, либо все материалы, если критерии не указаны.

Для удобства парсинга ответ возвращается **страницами**. Каждая страница содержит не более `limit` материалов. После обработки первой страницы переходите на следующую по URL из поля `next_page`, пока `next_page` не станет `null`.

## Endpoint

```
GET|POST https://kodik-api.com/list
```

## Пагинация

| Поле | Описание |
|------|----------|
| `limit` | Количество материалов на странице (1–100, по умолчанию 50) |
| `next_page` | URL следующей страницы или `null` |
| `prev_page` | URL предыдущей страницы или `null` |
| `total` | Общее количество материалов по запросу |

Параметр `next` в URL следующей страницы передаётся автоматически — используйте готовый `next_page`.

## Параметры

### Обязательные

| Название | Описание |
|----------|----------|
| `token` | API-токен |

### Необязательные — общие

| Название | По умолчанию | Доступные значения | Описание |
|----------|--------------|--------------------|----------|
| `limit` | `50` | `1` – `100` | Количество материалов за один запрос |
| `sort` | `updated_at` | `year`, `created_at`, `updated_at`, `kinopoisk_rating`, `imdb_rating`, `shikimori_rating` | Поле сортировки |
| `order` | `desc` | `asc`, `desc` | Направление сортировки |
| `types` | Все типы | **Фильмы:** `foreign-movie`, `soviet-cartoon`, `foreign-cartoon`, `russian-cartoon`, `anime`, `russian-movie`<br>**Сериалы:** `cartoon-serial`, `documentary-serial`, `russian-serial`, `foreign-serial`, `anime-serial`, `multi-part-film` | Фильтр по типу. Несколько через запятую |
| `year` | — | `1982`, `1982,2020` | Фильтр по году |
| `translation_id` | — | `714`, `714,720` | Фильтр по ID озвучки |
| `block_translations` | — | `714`, `714,720` | Исключить озвучки из результатов |
| `translation_type` | — | `voice`, `subtitles` | Только голосовой перевод или субтитры |
| `has_field` | — | `kinopoisk_id`, `imdb_id`, `mdl_id`, `worldart_link`, `shikimori_id` | Материалы с **хотя бы одним** полем. Для **всех** — `has_field_and` |
| `camrip` | — | `true`, `false` | `false` — только качественная картинка |
| `lgbt` | — | `true`, `false` | `false` — без LGBT-сцен |
| `with_seasons` | `false` | `true`, `false` | Добавить поле `seasons` с сезонами сериала |
| `with_episodes` | `false` | `true`, `false` | Добавить `seasons` и `episodes` — номера серий → ссылки на плеер |
| `with_episodes_data` | `false` | `true`, `false` | Как `with_episodes`, но серии — объекты с `link`, `title`, `screenshots` |
| `with_page_links` | `false` | `true`, `false` | Заменить ссылки на плееры ссылками на страницы Kodik |
| `not_blocked_in` | — | `RU`, `RU,UA` | Материалы, не заблокированные в указанных странах |
| `not_blocked_for_me` | — | `true`, `false` | Kodik сам определяет страну запроса и скрывает заблокированное |
| `with_material_data` | `false` | `true`, `false` | Добавить `material_data` с информацией КиноПоиск / Shikimori / MyDramaList |

### Параметры сезонов и серий

| Параметр | Когда использовать |
|----------|-------------------|
| `with_seasons=true` | Нужны только сезоны без детализации серий |
| `with_episodes=true` | Плеер: ссылки на каждую серию (строки) |
| `with_episodes_data=true` | Плеер + названия серий + скриншоты каждой серии |

> `with_episodes` и `with_episodes_data` автоматически добавляют `seasons`, даже если `with_seasons=false`.

### Фильтрация по метаданным

| Название | Пример | Описание |
|----------|--------|----------|
| `countries` | `США`, `США,Россия` | Страна. `_and` для пересечения |
| `genres`, `anime_genres`, `drama_genres`, `all_genres` | `биография,боевик` | Жанры. `_and` для пересечения |
| `duration` | `30`, `40-80` | Длительность в минутах |
| `kinopoisk_rating`, `imdb_rating`, `shikimori_rating`, `mydramalist_rating` | `7.0`, `6.5-8.2` | Рейтинги |
| `actors`, `directors`, `producers`, `writers`, `composers`, `editors`, `designers`, `operators` | — | Персоны. `_and` для пересечения |
| `rating_mpaa` | `PG-13` | Возрастной рейтинг MPAA |
| `minimal_age` | `16`, `12-16` | Минимальный возраст |
| `anime_kind` | `tv`, `ova`, `movie` | Тип аниме |
| `mydramalist_tags` | `Friendship,Violence` | Теги MyDramaList |
| `anime_status`, `drama_status`, `all_status` | `ongoing`, `released` | Статус (важно для календаря) |
| `anime_studios` | `J.C.Staff` | Студии |
| `anime_licensed_by` | `Wakanim` | Владельцы лицензии |

## Структура ответа — корневой объект

| Поле | Описание |
|------|----------|
| `time` | Время выполнения запроса |
| `total` | Общее количество материалов |
| `prev_page` | URL предыдущей страницы или `null` |
| `next_page` | URL следующей страницы или `null` |
| `results` | Массив материалов |

## Структура ответа — материал (`results[]`)

| Поле | Описание |
|------|----------|
| `id` | Уникальный ID материала (например, `serial-452654`) |
| `title` | Название |
| `title_orig` | Оригинальное название |
| `other_title` | Другое название (часто в аниме) |
| `link` | Ссылка на плеер |
| `year` | Год |
| `kinopoisk_id` | ID КиноПоиска |
| `imdb_id` | ID IMDb |
| `mdl_id` | ID MyDramaList |
| `worldart_link` | Ссылка на World Art |
| `shikimori_id` | ID Shikimori (только цифры) — **ключ связи с вашим сайтом** |
| `type` | Тип материала |
| `quality` | Качество видео |
| `camrip` | Является ли материал камрипом |
| `lgbt` | Содержит ли LGBT-сцены |
| `translation` | Объект озвучки: `id`, `title`, `type` (`voice` / `subtitles`) |
| `created_at` | Дата создания (ISO 8601) |
| `updated_at` | Дата обновления (ISO 8601) |
| `blocked_countries` | Страны блокировки или `[]` |
| `seasons` | Сезоны и серии (если `with_seasons` / `with_episodes` / `with_episodes_data`) |
| `last_season` | Номер последнего сезона (сериалы) |
| `last_episode` | Номер последнего эпизода (сериалы) |
| `episodes_count` | Общее количество эпизодов (сериалы) |
| `blocked_seasons` | Блокировки по сезонам/сериям (сериалы) |
| `screenshots` | Кадры из видео (для сериалов — из первой серии) |
| `material_data` | Метаданные (если `with_material_data=true`) |

### Объект `translation`

```json
{
  "id": 611,
  "title": "ColdFilm",
  "type": "voice"
}
```

### Поле `blocked_seasons` (сериалы)

| Значение | Значение |
|----------|----------|
| `"all"` | Заблокирован весь сериал |
| `{ "5": "all" }` | Заблокирован весь сезон 5 |
| `{ "7": ["1", "2", "3"] }` | Заблокированы отдельные серии |
| `{}` | Ничего не заблокировано |

### Поле `seasons` (при `with_episodes=true`)

```json
{
  "5": {
    "link": "http://kodikplayer.com/season/27856/.../720p",
    "episodes": {
      "1": "http://kodikplayer.com/seria/119601/.../720p",
      "2": "http://kodikplayer.com/seria/203940/.../720p"
    }
  }
}
```

При `with_episodes_data=true` значения в `episodes` — объекты:

```json
{
  "1": {
    "link": "...",
    "title": "Название серии",
    "screenshots": ["..."]
  }
}
```

## Поле `material_data`

Присутствует только при `with_material_data=true`.
Если для материала нет данных КиноПоиск / Shikimori / MyDramaList — поле отсутствует.
Если нет конкретного поля внутри — оно тоже отсутствует.

→ Полная таблица полей: [material_data.md](./material_data.md)

Ключевые поля для аниме-сайта:

| Поле | Описание | Источник |
|------|----------|----------|
| `next_episode_at` | Время выхода следующей серии | Shikimori, MyDramaList |
| `anime_status` | `anons`, `ongoing`, `released` | Shikimori |
| `episodes_total` | Всего эпизодов | Shikimori, MyDramaList |
| `episodes_aired` | Уже вышло эпизодов | Shikimori, MyDramaList |
| `shikimori_rating` | Рейтинг | Shikimori |
| `anime_genres` | Жанры | Shikimori |
| `poster_url` / `anime_poster_url` | Постер | KinoPoisk / Shikimori |
| `description` / `anime_description` | Описание | KinoPoisk / Shikimori |

## Примеры запросов

### Базовый список

```
GET https://kodik-api.com/list?token=YOUR_TOKEN
```

### Аниме-сериалы с сериями и метаданными

```
GET https://kodik-api.com/list?token=YOUR_TOKEN&types=anime-serial&with_episodes=true&with_material_data=true
```

### Ongoing-аниме для календаря

```
GET https://kodik-api.com/list?token=YOUR_TOKEN&types=anime-serial&anime_status=ongoing&with_material_data=true&sort=updated_at&order=desc
```

### Материалы с Shikimori ID

```
GET https://kodik-api.com/list?token=YOUR_TOKEN&types=anime-serial&has_field=shikimori_id&with_material_data=true
```

## Пример ответа (фильм)

```json
{
  "time": "5ms",
  "total": 30590,
  "prev_page": null,
  "next_page": "https://kodik-api.com/list?token=YOUR_TOKEN&next=...",
  "results": [
    {
      "id": "movie-452654",
      "type": "foreign-movie",
      "link": "http://kodikplayer.com/video/19850/.../720p",
      "title": "Спортлото-82",
      "title_orig": "Спортлото-82",
      "translation": {
        "id": 703,
        "title": "Не требуется",
        "type": "voice"
      },
      "year": 1982,
      "kinopoisk_id": "43949",
      "imdb_id": "tt0084716",
      "quality": "HDTVRip 720p",
      "blocked_countries": [],
      "created_at": "2017-12-03T09:12:49Z",
      "updated_at": "2018-04-10T08:25:23Z",
      "screenshots": [
        "https://i.kodikres.com/screenshots/video/50811/1.jpg"
      ]
    }
  ]
}
```

## Пример ответа (сериал с сезонами)

```json
{
  "time": "5ms",
  "total": 30590,
  "prev_page": null,
  "next_page": "https://kodik-api.com/list?token=YOUR_TOKEN&next=...",
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
      "imdb_id": "tt0944947",
      "quality": "WEB-DL 720p",
      "blocked_countries": ["RU"],
      "blocked_seasons": {
        "5": "all",
        "7": ["1", "2", "3", "5"]
      },
      "created_at": "2017-07-17T16:34:52Z",
      "updated_at": "2018-04-06T14:19:27Z",
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
        "poster_url": "https://st.kp.yandex.net/images/film_iphone/iphone360_464963.jpg",
        "kinopoisk_rating": 9,
        "genres": ["фэнтези", "боевик", "драма"]
      },
      "screenshots": [
        "https://i.kodikres.com/screenshots/video/50811/1.jpg"
      ]
    }
  ]
}
```

## Применение на вашем сайте

| Задача | Параметры |
|--------|-----------|
| **Календарь** | `types=anime-serial`, `anime_status=ongoing`, `with_material_data=true` → поле `next_episode_at` |
| **База серий** | `with_episodes=true`, `has_field=shikimori_id` → `last_episode`, `episodes_count` |
| **Плеер** | `with_episodes=true` или `with_episodes_data=true` → `seasons.episodes` |
| **Карточка аниме** | `with_material_data=true` → описание, рейтинг, постер |
| **Связь с Shikimori** | `shikimori_id` в каждом материале |

## Связанные разделы

- [material_data — структура метаданных](./material_data.md)
- [`/search`](./search.md)
- [`/translations/v2`](./translations.md)
- [Обзор API](./overview.md)
