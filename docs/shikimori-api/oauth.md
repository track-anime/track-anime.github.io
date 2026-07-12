# OAuth2 — авторизация Shikimori

> Источник: [shikimori.one/oauth](https://shikimori.one/oauth)

## Схема OAuth2

```
Client → Authorization Grant → Shikimori
Client ← Authorization Code ← Shikimori
Client → Access Token → Shikimori
Client ← Protected Resource ← Shikimori
Client → Refresh Token → Shikimori (когда access token истёк)
Client ← New Access Token + Refresh Token ← Shikimori
```

## Шаг 1. Создать приложение

Создайте OAuth-приложение: [shikimori.one/oauth/applications](https://shikimori.one/oauth/applications)

Сохраните `CLIENT_ID` и `CLIENT_SECRET`.

## Шаг 2. Authorization Code

Перенаправьте пользователя на страницу авторизации:

```
GET https://shikimori.one/oauth/authorize
  ?client_id=CLIENT_ID
  &redirect_uri=REDIRECT_URI
  &response_type=code
  &scope=user_rates+friends
```

Пользователь авторизует приложение → редирект на `REDIRECT_URI?code=AUTHORIZATION_CODE`.

## Шаг 3. Access Token

```bash
curl -X POST "https://shikimori.one/oauth/token" \
  -H "User-Agent: APPLICATION_NAME" \
  -F grant_type="authorization_code" \
  -F client_id="CLIENT_ID" \
  -F client_secret="CLIENT_SECRET" \
  -F code="AUTHORIZATION_CODE" \
  -F redirect_uri="REDIRECT_URI"
```

**Access Token живёт 1 день.**

При истечении — ответ `401`:

```json
{
  "error": "invalid_token",
  "error_description": "The access token is invalid",
  "state": "unauthorized"
}
```

## Шаг 4. Запросы к API

```bash
curl -X GET "https://shikimori.one/api/users/whoami" \
  -H "User-Agent: APPLICATION_NAME" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## Шаг 5. Refresh Token

```bash
curl -X POST "https://shikimori.one/oauth/token" \
  -H "User-Agent: APPLICATION_NAME" \
  -F grant_type="refresh_token" \
  -F client_id="CLIENT_ID" \
  -F client_secret="CLIENT_SECRET" \
  -F refresh_token="REFRESH_TOKEN"
```

Возвращает новый `access_token` и `refresh_token`.

## OAuth Scopes

| Scope | Описание |
|-------|----------|
| `user_rates` | Изменение списков аниме и манги |
| `friends` | Добавление и удаление друзей |
| `messages` | Чтение и отправка личных сообщений |
| `comments` | Комментирование от имени пользователя |
| `topics` | Создание топиков и рецензий |
| `content` | Изменение базы данных сайта |
| `clubs` | Вступление и выход из клубов |
| `ignores` | Игнорирование пользователей |

Несколько scope через `+`:

```
scope=user_rates+friends
```

### Для track-anime рекомендуемые scope

```
user_rates+friends
```

## Важно для бэкенда

| Правило | Почему |
|---------|--------|
| Токены **только на сервере** | Не хранить в браузере/localStorage |
| Refresh автоматически | Access token живёт 1 день |
| User-Agent = имя приложения | Без этого — бан IP |
| Rate limiter 5 rps / 90 rpm | Очередь запросов на сервере |

## Связанные разделы

- [user_rates.md](./user_rates.md) — требует scope `user_rates`
- [friends.md](./friends.md) — требует scope `friends`
- [users.md](./users.md) — `whoami` для текущего пользователя
