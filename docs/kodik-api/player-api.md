# API плеера Kodik

> Источник: документация Kodik — раздел «API плеера»

## Описание

API плеера позволяет:

- получать актуальную информацию во время воспроизведения;
- управлять плеером через JavaScript на вашем сайте.

Общение с плеером происходит через **`postMessage`**.

## Разделы

| Раздел | Направление | Описание |
|--------|-------------|----------|
| [Получение информации](#получение-информации) | Плеер → сайт | События воспроизведения |
| [Управление плеером](#управление-плеером) | Сайт → плеер | Команды через iframe |

## Встраивание плеера

```html
<iframe
  id="kodik-player"
  src="//kodikplayer.com/serial/37172/55dacb8c87e072e0966bc39ddce66224/720p"
  width="610"
  height="370"
  frameborder="0"
  allowfullscreen
  allow="autoplay *; fullscreen *"
></iframe>
```

Ссылку на плеер получайте через [`/search`](./search.md) или [`/list`](./list.md) — поле `link` или `seasons.{N}.episodes.{N}`.

---

## Получение информации

Добавьте обработчик входящих сообщений. `message.data` содержит два параметра:

| Поле | Описание |
|------|----------|
| `key` | Тип события — по нему фильтруют сообщения |
| `value` | Данные события |

### Пример обработчика

```html
<script type="text/javascript">
  function kodikMessageListener(message) {
    if (message.data.key == 'kodik_player_time_update') {
      console.log(message.data.value);
    }
  }

  if (window.addEventListener) {
    window.addEventListener('message', kodikMessageListener);
  } else {
    window.attachEvent('onmessage', kodikMessageListener);
  }
</script>
```

### События (плеер → сайт)

| `key` | `value` (пример) | Описание |
|-------|------------------|----------|
| `kodik_player_play` | — | Начало или возобновление воспроизведения |
| `kodik_player_pause` | — | Пауза |
| `kodik_player_seek` | `{ time: 342.543213 }` | Перемотка. `time` — секунды |
| `kodik_player_time_update` | `14` | Текущее время (сек). Обновляется раз в секунду, округлённое |
| `kodik_player_duration_update` | `6531.48` | Длительность (сек). В начале и при смене качества |
| `kodik_player_video_started` | — | Начало воспроизведения видео |
| `kodik_player_video_ended` | — | Окончание воспроизведения |
| `kodik_player_volume_change` | `{ muted: false, volume: 0.47 }` | Изменение громкости |
| `kodik_player_current_episode` | см. ниже | Текущий сезон, эпизод, озвучка. В начале серии. Для фильма `episode` и `season` = `null` |
| `kodik_player_speed_change` | `{ speed: 1.5 }` | Изменение скорости |
| `kodik_player_skip_button` | `{ title: "Пропустить опенинг" }` | Нажатие кнопки пропуска опенинга/эндинга |
| `kodik_player_enter_pip` | — | Вход в «Картинка в картинке» |
| `kodik_player_exit_pip` | — | Выход из PiP |

### `kodik_player_current_episode` — структура `value`

```json
{
  "episode": 13,
  "season": 3,
  "translation": {
    "id": 718,
    "title": "LostFilm"
  }
}
```

### Тексты кнопки пропуска (`kodik_player_skip_button`)

- «Пропустить опенинг»
- «Пропустить эндинг»
- «Пропустить»
- «Пропустить вступление»
- «Пропустить титры»

---

## Управление плеером

Команды отправляются через `postMessage` в **iframe** плеера.

Формат сообщения:

```javascript
{
  key: "kodik_player_api",
  value: { method: "...", ... }
}
```

### Пример

```html
<iframe id="kodik-player" src="//kodikplayer.com/serial/37172/.../720p" ...></iframe>

<script type="text/javascript">
  var kodikIframe = document.getElementById("kodik-player").contentWindow;

  kodikIframe.postMessage(
    { key: "kodik_player_api", value: { method: "seek", seconds: 67 } },
    '*'
  );
</script>
```

### Команды (сайт → плеер)

| `value` | Описание |
|---------|----------|
| `{ method: "play" }` | Запуск. **Первый запуск** — только по действию пользователя (клик). Снятие с паузы — без ограничения |
| `{ method: "pause" }` | Пауза |
| `{ method: "seek", seconds: 64 }` | Перемотка на точку (секунды) |
| `{ method: "volume", volume: 0.7 }` | Громкость от `0` до `1` |
| `{ method: "mute" }` | Выключить звук |
| `{ method: "unmute" }` | Включить звук |
| `{ method: "change_episode", season: 5, episode: 3 }` | Переключить серию. `episode` обязателен. `season` — для сериалов; для плеера сезона можно не указывать |
| `{ method: "speed", speed: 2 }` | Скорость от `0.25` до `2`. Обычная: `1` |
| `{ method: "enter_pip" }` | PiP — **только по действию пользователя** |
| `{ method: "exit_pip" }` | Выход из PiP |
| `{ method: "get_time" }` | Запрос текущего времени. Ответ — событие `kodik_player_time` (может быть дробным, напр. `615.804453`) |

### `change_episode` — нюансы

| Тип плеера | `season` | `episode` |
|------------|----------|-----------|
| Сериал (есть селектор сезонов) | Необязателен — берётся текущий | **Обязателен** |
| Плеер сезона (без селектора) | Не указывать | **Обязателен** |

---

## Применение на track-anime

| Задача | Событие / команда |
|--------|-------------------|
| Запомнить прогресс просмотра | `kodik_player_time_update` → sync с Shikimori |
| Автопереход к следующей серии | `kodik_player_video_ended` → `change_episode` |
| Отображение «серия X, сезон Y» | `kodik_player_current_episode` |
| Продолжить с места остановки | `seek` с сохранённым временем |
| Кнопка «пропустить опенинг» на сайте | слушать `kodik_player_skip_button` или вызывать `seek` |

## TypeScript-обёртка (рекомендация для Next.js)

```typescript
type KodikPlayerEvent =
  | { key: 'kodik_player_time_update'; value: number }
  | { key: 'kodik_player_current_episode'; value: { episode: number | null; season: number | null; translation: { id: number; title: string } } }
  | { key: 'kodik_player_video_ended'; value: undefined }
  // ...

type KodikPlayerCommand =
  | { method: 'play' }
  | { method: 'pause' }
  | { method: 'seek'; seconds: number }
  | { method: 'change_episode'; season?: number; episode: number }
  // ...

function sendKodikCommand(iframe: HTMLIFrameElement, command: KodikPlayerCommand) {
  iframe.contentWindow?.postMessage(
    { key: 'kodik_player_api', value: command },
    '*'
  );
}
```

## Связанные разделы

- [`/search`](./search.md) — получить ссылку на плеер по `shikimori_id`
- [`/list`](./list.md) — ссылки на серии в `seasons.episodes`
- [Обзор API](./overview.md)
