# AniSkip API

## Purpose

AniSkip используется только на сервере для OP/ED/recap таймингов в Kodik player.
Клиентский код вызывает внутренний endpoint Track Anime:

```http
GET /api/anime/{shikimoriId}/skip-times?season=1&episode=1&episodeLength=1440
```

## External Endpoint

```http
GET https://api.aniskip.com/v2/skip-times/{malId}/{episodeNumber}
```

Query params:

- `episodeLength` — длительность серии в секундах, в Track Anime округляется к 5-секундному bucket
- `types` — повторяемый параметр; используются `op`, `ed`, `mixed-op`, `mixed-ed`, `recap`

## Data Flow

1. `/api/anime/[shikimoriId]/skip-times` принимает Shikimori ID, номер сезона/серии и длительность серии.
2. `src/lib/aniskip.ts` получает `malId` через `src/lib/shikimori/mal-id.ts`.
3. AniSkip запрашивается по `malId + episodeNumber + episodeLength`.
4. Найденные интервалы сохраняются в `AnimeEpisodeSkipTime`.
5. `AnimeWatchPanel` смещает интервалы на intro-offset выбранной озвучки и показывает кнопку пропуска, когда текущая позиция рядом с интервалом.
6. Для админа `/api/admin/anime/{shikimoriId}/skip-times-prefetch` фоном прогревает кэш по доступным сериям вокруг текущей серии.

## Cache

- Provider key: `aniskip`
- TTL: 30 дней
- Положительные результаты кэшируются в `AnimeEpisodeSkipTime`
- Пустые ответы не кэшируются отдельной negative-cache записью

## Constraints

- Основной ключ сайта остается `shikimoriId`; `malId` нужен только для внешних интеграций.
- Внешний AniSkip API не вызывается из client components.
- Тайминги запрашиваются лениво при открытии серии, потому что AniSkip требует фактическую длительность эпизода.
- Кэш хранит базовые AniSkip-интервалы; смещение intro-offset применяется только в UI для выбранной озвучки.
