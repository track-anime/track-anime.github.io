# Friends — друзья

> Источник: [shikimori.one/api/doc/1.0/friends](https://shikimori.one/api/doc/1.0/friends)

## POST /api/friends/:id — добавить в друзья

**OAuth scope:** `friends`

```bash
POST /api/friends/1234567
```

```json
{
  "notice": "user_1234567 добавлен в друзья"
}
```

## DELETE /api/friends/:id — удалить из друзей

**OAuth scope:** `friends`

```bash
DELETE /api/friends/1234567
```

```json
{
  "notice": "user_1234567 удалён из друзей"
}
```

## GET /api/users/:id/friends — список друзей

Публичный эндпоинт (без scope для чтения).

```bash
GET /api/users/12345/friends?page=1&limit=100
```

→ [users.md](./users.md)

## OAuth scope

При авторизации включите:

```
scope=user_rates+friends
```

## Связанные разделы

- [oauth.md](./oauth.md)
- [users.md](./users.md)
