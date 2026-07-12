# `material_data` — структура метаданных

> Источник: раздел документации `/list` на [bd.kodikres.com](https://bd.kodikres.com/api/info/list)

Поле `material_data` возвращается в ответе `/list` (и `/search`) при `with_material_data=true`.

## Правила наличия полей

- Если для материала нет данных КиноПоиск / Shikimori / MyDramaList — **`material_data` отсутствует целиком**.
- Если внутри нет конкретного поля — **оно отсутствует** (например, нет `actors` — поле не возвращается).

## Поля

| Поле | Описание | Источник | Пример |
|------|----------|----------|--------|
| `title` | Название | KinoPoisk, Shikimori | `"Аватар"` |
| `anime_title` | Название аниме | Shikimori | `"Аватар"` |
| `title_en` | Оригинальное название | KinoPoisk, Shikimori, MyDramaList | `"Avatar"` |
| `other_titles` | Другие названия (массив) | Shikimori, MyDramaList | `["Аватар", "Аватар 2"]` |
| `other_titles_en` | Другие названия на английском (массив) | Shikimori | `["Avatar", "Avatar 2"]` |
| `other_titles_jp` | Другие названия на японском (массив) | Shikimori | `["アバター"]` |
| `anime_license_name` | Название лицензии в России | Shikimori | `"Аватар"` |
| `anime_licensed_by` | Владельцы лицензий (массив) | Shikimori | `["Wakanim", "Русский Репортаж"]` |
| `anime_kind` | Тип аниме | Shikimori | `"ova"` |
| `mydramalist_tags` | Теги MyDramaList | MyDramaList | `["Friendship", "Violence"]` |
| `all_status` | Статус материала | Shikimori, MyDramaList | `"released"` |
| `anime_status` | Статус аниме | Shikimori | `"released"` |
| `drama_status` | Статус дорамы | MyDramaList | `"released"` |
| `year` | Год | KinoPoisk | `2016` |
| `tagline` | Слоган | KinoPoisk | `"An entire universe. Once and for all"` |
| `description` | Описание | KinoPoisk, Shikimori | `"..."` |
| `anime_description` | Описание аниме | Shikimori | `"..."` |
| `poster_url` | Ссылка на постер | KinoPoisk, Shikimori, MyDramaList | `"https://st.kp.yandex.net/..."` |
| `anime_poster_url` | Постер аниме | Shikimori | `"https://shiki.one/..."` |
| `drama_poster_url` | Постер дорамы | MyDramaList | `"https://i.mydramalist.com/..."` |
| `screenshots` | Кадры (массив) | Shikimori | `["https://site.com/image1.png"]` |
| `duration` | Продолжительность (минуты) | KinoPoisk, Shikimori, MyDramaList | `160` |
| `countries` | Страны (массив) | KinoPoisk, MyDramaList | `["США", "Великобритания"]` |
| `all_genres` | Все жанры (массив) | KinoPoisk, Shikimori, MyDramaList | `["комедия", "боевик"]` |
| `genres` | Жанры (массив) | KinoPoisk | `["комедия", "боевик"]` |
| `anime_genres` | Аниме-жанры (массив) | Shikimori | `["приключения", "комедия"]` |
| `drama_genres` | Жанры дорам (массив) | MyDramaList | `["приключения", "комедия"]` |
| `anime_studios` | Аниме-студии (массив) | Shikimori | `["Studio Deen"]` |
| `kinopoisk_rating` | Рейтинг КиноПоиска | KinoPoisk | `7.2` |
| `kinopoisk_votes` | Голоса КиноПоиска | KinoPoisk | `723856` |
| `imdb_rating` | Рейтинг IMDb | KinoPoisk | `7.2` |
| `imdb_votes` | Голоса IMDb | KinoPoisk | `723856` |
| `shikimori_rating` | Рейтинг Shikimori | Shikimori | `7.2` |
| `shikimori_votes` | Голоса Shikimori | Shikimori | `723856` |
| `mydramalist_rating` | Рейтинг MyDramaList | MyDramaList | `7.2` |
| `mydramalist_votes` | Голоса MyDramaList | MyDramaList | `723856` |
| `premiere_ru` | Премьера в России | KinoPoisk | `"2018-04-16"` |
| `premiere_world` | Мировая премьера | KinoPoisk | `"2018-04-16"` |
| `aired_at` | Дата начала показа | Shikimori, MyDramaList | `"2018-04-16"` |
| `released_at` | Дата конца показа | Shikimori, MyDramaList | `"2018-04-16"` |
| `next_episode_at` | Время выхода следующей серии | Shikimori, MyDramaList | `"2021-04-06T14:19:27Z"` |
| `rating_mpaa` | Рейтинг MPAA | KinoPoisk, Shikimori | `"PG-13"` |
| `minimal_age` | Минимальный возраст | KinoPoisk, MyDramaList, Shikimori | `16` |
| `episodes_total` | Всего эпизодов | Shikimori, MyDramaList | `14` |
| `episodes_aired` | Вышло эпизодов | Shikimori, MyDramaList | `14` |
| `actors` | Актёры (массив) | KinoPoisk, MyDramaList | `["Роберт Дауни мл."]` |
| `directors` | Режиссёры (массив) | KinoPoisk, MyDramaList | `["..."]` |
| `producers` | Продюсеры (массив) | KinoPoisk, MyDramaList | `["..."]` |
| `writers` | Сценаристы (массив) | KinoPoisk, MyDramaList | `["..."]` |
| `composers` | Композиторы (массив) | KinoPoisk, MyDramaList | `["..."]` |
| `editors` | Монтажёры (массив) | KinoPoisk, MyDramaList | `["..."]` |
| `designers` | Художники (массив) | KinoPoisk, MyDramaList | `["..."]` |
| `operators` | Операторы (массив) | KinoPoisk, MyDramaList | `["..."]` |

## Поля для календаря и расписания

| Поле | Назначение |
|------|------------|
| `next_episode_at` | Дата/время следующей серии — основа для календаря |
| `anime_status` | `anons` / `ongoing` / `released` |
| `episodes_total` | Сколько серий всего |
| `episodes_aired` | Сколько уже вышло |
| `aired_at` | Когда начался показ |
| `released_at` | Когда закончился показ |

## Связанные разделы

- [`/list`](./list.md)
- [`/search`](./search.md)
