# GraphQL API

> Источник: [shikimori.one/api/doc/graphql](https://shikimori.one/api/doc/graphql)  
> Playground: [shikimori.one/api/graphql](https://shikimori.one/api/graphql)

## Описание

GraphQL — **рекомендуемая** версия API Shikimori. Prefer GraphQL over v2/v1 when possible.

> **Новые постеры** аниме/манги/персонажей доступны **только через GraphQL**.

## Endpoint

```
POST https://<configured-shikimori-host>/api/graphql
```

В Track Anime endpoint строится через настроенный Shikimori host (`shikimori.io` /
`shikimori.one`). Для текущей интеграции `malId` проверенный рабочий host — `shikimori.io`.

Заголовки:

```http
User-Agent: APPLICATION_NAME
Content-Type: application/json
Authorization: Bearer ACCESS_TOKEN   # если нужна auth
```

## Доступные корневые запросы

- `animes`
- `mangas`
- `characters`
- `people`
- `user_rates`
- `contests`
- и другие (см. Schema в Playground)

## Пример запроса

```graphql
{
  animes(search: "bakemono", limit: 1, kind: "!special") {
    id
    malId
    name
    russian
    licenseNameRu
    english
    japanese
    synonyms
    kind
    rating
    score
    status
    episodes
    episodesAired
    duration
    airedOn { year month day date }
    releasedOn { year month day date }
    url
    season
    poster { id originalUrl mainUrl }
    fansubbers
    fandubbers
    licensors
    createdAt
    updatedAt
    nextEpisodeAt
    isCensored
    genres { id name russian kind }
  }
}
```

## Пример с переменными (curl)

```bash
curl -X POST "https://shikimori.one/api/graphql" \
  -H "User-Agent: TrackAnime" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ animes(ids: \"5114\", limit: 1) { id name russian poster { mainUrl } } }"}'
```

## Когда использовать GraphQL vs REST

| Задача | REST v1/v2 | GraphQL |
|--------|------------|---------|
| CRUD списков | **v2 user_rates** | user_rates mutation |
| Календарь | `/api/calendar` | animes + nextEpisodeAt |
| Постеры (новые) | Старые URL | **poster { mainUrl }** |
| Карточка аниме | `/api/animes/:id` | Гибкий query |
| Простота для AI-ассистента | **REST проще** | Больше гибкости |

## Рекомендация для track-anime

На старте используйте **REST**:

- v2 `user_rates` — списки
- v1 `animes`, `users`, `calendar` — каталог и расписание

GraphQL используется точечно для `malId` mapping (`src/lib/shikimori/mal-id.ts`):

- запрос `animes(ids: "...") { id malId }`
- результат кэшируется в `AnimeExternalIdMap`
- `malId` нужен для интеграций вроде AniSkip, но основной ключ сайта остаётся `shikimoriId`

Для остальных задач GraphQL подключайте только когда понадобятся **новые постеры** или сложные выборки.

## Связанные разделы

- [overview.md](./overview.md)
- [animes.md](./animes.md)
