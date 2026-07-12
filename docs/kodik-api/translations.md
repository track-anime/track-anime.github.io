# `/translations/v2` — озвучки

> Источник: [bd.kodikres.com/api/info/translations](https://bd.kodikres.com/api/info/translations)

## Описание

Возвращает список всех возможных озвучек либо для всех материалов, либо для материалов, отфильтрованных вашими параметрами.

> Документация по первой версии (`/translations`) находится на отдельной странице в официальной документации Kodik.

## Endpoint

```
GET|POST https://kodik-api.com/translations/v2
```

## Параметры

### Обязательные

| Название | Стандартное значение | Описание |
|----------|----------------------|----------|
| `token` | — | API-токен. Необходимо указать для успешного выполнения запроса. |

### Необязательные — общие

| Название | Стандартное значение | Доступные значения | Описание |
|----------|----------------------|--------------------|----------|
| `types` | Все типы | **Фильмы:** `foreign-movie`, `soviet-cartoon`, `foreign-cartoon`, `russian-cartoon`, `anime`, `russian-movie`<br>**Сериалы:** `cartoon-serial`, `documentary-serial`, `russian-serial`, `foreign-serial`, `anime-serial`, `multi-part-film` | Фильтрация материалов по типу. Несколько типов через запятую. |
| `year` | — | `0000` – `9999` | Фильтрация материалов по году. |
| `translation_type` | — | `voice`, `subtitles` | Фильтрация по типу перевода: голосовой / субтитры. |
| `has_field` | — | `kinopoisk_id`, `imdb_id`, `mdl_id`, `worldart_link`, `shikimori_id` | Материалы, у которых есть **хотя бы одно** из перечисленных полей. Для требования **всех** полей — `has_field_and`. |
| `lgbt` | — | `true`, `false` | Фильтрация по LGBT-сценам. `false` — только без LGBT. Без параметра — все материалы. |
| `sort` | `title` | `title`, `count` | Сортировка: по названию озвучки или по количеству материалов с этой озвучкой. |

### Фильтрация по метаданным (КиноПоиск, Shikimori, MyDramaList)

| Название | Стандартное значение | Пример | Описание |
|----------|----------------------|--------|----------|
| `countries` | — | `США`, `США,Россия` | По стране. Несколько значений — **хотя бы одна** страна. Для **всех** стран — `countries_and`. Регистрозависимый. |
| `genres` | — | `биография`, `биография,боевик` | Жанры КиноПоиска. Несколько — **хотя бы один**. Для **всех** — `genres_and`. Регистронезависимый. |
| `anime_genres` | — | — | Жанры Shikimori. Аналогично, суффикс `_and` для пересечения. |
| `drama_genres` | — | — | Жанры MyDramaList. |
| `all_genres` | — | — | Жанры из всех источников. |
| `duration` | — | `30`, `40-80` | Продолжительность в минутах: точное значение или интервал. |
| `kinopoisk_rating` | — | `7.0`, `6`, `6.5-8.2` | Рейтинг КиноПоиска: значение или интервал. |
| `imdb_rating` | — | — | Рейтинг IMDb. |
| `shikimori_rating` | — | — | Рейтинг Shikimori. |
| `mydramalist_rating` | — | — | Рейтинг MyDramaList. |
| `actors` | — | `Крис Хемсворт`, `Крис Хемсворт,Марк Руффало` | По актёрам. Несколько — **хотя бы один**. Для **всех** — `actors_and`. |
| `directors` | — | — | Режиссёры. |
| `producers` | — | — | Продюсеры. |
| `writers` | — | — | Сценаристы. |
| `composers` | — | — | Композиторы. |
| `editors` | — | — | Монтажёры. |
| `designers` | — | — | Художники. |
| `operators` | — | — | Операторы. |
| `rating_mpaa` | — | `G`, `PG`, `PG-13`, `R`, `R+`, `Rx` | Возрастной рейтинг MPAA. Несколько через запятую. |
| `minimal_age` | — | `16`, `12-16` | Минимальный возраст просмотра: значение или диапазон. |
| `anime_kind` | — | `tv`, `movie`, `ova`, `ona`, `special`, `music`, `tv_13`, `tv_24`, `tv_48` | Тип аниме. Несколько — **хотя бы один**. |
| `mydramalist_tags` | — | `Friendship`, `Friendship,Violence` | Теги MyDramaList. Для **всех** тегов — `mydramalist_tags_and`. |
| `anime_status` | — | `anons`, `ongoing`, `released` | Статус Shikimori. |
| `drama_status` | — | — | Статус MyDramaList. |
| `all_status` | — | `ongoing,released` | Статус из всех источников. |
| `anime_studios` | — | `J.C.Staff`, `J.C.Staff,Studio Hibari` | Аниме-студии. Для **всех** — `anime_studios_and`. |
| `anime_licensed_by` | — | `Wakanim`, `Wakanim,Русский Репортаж` | Владельцы лицензии. Для **всех** — `anime_licensed_by_and`. |

### Соглашения по фильтрам

- **`param`** — материал подходит, если совпадает **хотя бы одно** значение.
- **`param_and`** — материал подходит, только если совпадают **все** указанные значения.

## Структура ответа

| Поле | Описание |
|------|----------|
| `time` | Время выполнения запроса |
| `total` | Общее количество записей |
| `results` | Массив результатов |
| `results[].id` | ID озвучки (используется в `translation_id` и `block_translations`) |
| `results[].title` | Название озвучки |
| `results[].count` | Количество материалов с данной озвучкой |

## Пример запроса

```
GET https://kodik-api.com/translations/v2?token=YOUR_TOKEN&types=anime-serial
```

Только голосовые озвучки:

```
GET https://kodik-api.com/translations/v2?token=YOUR_TOKEN&types=anime-serial&translation_type=voice
```

## Пример ответа

```json
{
  "time": "5ms",
  "total": 30590,
  "results": [
    {
      "id": 735,
      "title": "2x2",
      "count": 26
    },
    {
      "id": 824,
      "title": "3df voice",
      "count": 16
    }
  ]
}
```

## Использование в других эндпоинтах

ID озвучки из этого ресурса используется в параметрах других запросов:

| Параметр | Описание |
|----------|----------|
| `translation_id` | Показать только материалы с указанной озвучкой |
| `block_translations` | Исключить указанные озвучки из результатов |

## Связанные разделы

- [Обзор API](./overview.md)
- [`/qualities/v2`](./qualities.md)
- [`/list`](./list.md)
- [`/search`](./search.md)
