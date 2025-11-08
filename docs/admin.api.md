# Admin API (Day 2 – Roles & Verification)

> All admin endpoints are protected by `isAuth` → `requireRole('admin')`.
> Validation: `param('id').isMongoId()`; for role change also `body('role').isIn(ROLES_ARRAY)`.
> CORS: expose `X-Role-Changed` so the browser can read it (`exposedHeaders: ['X-Role-Changed']`).

## PATCH /admin/roles/:id

Change a user's single role.

- Auth: Bearer (Admin)
- Response Header: `X-Role-Changed: true` (client should call `/auth/refresh`)
- Validation:
  - `param.id` – MongoID
  - `body.role` – one of `user | coach | scout | admin`
- 200 OK

```json
{
  "msg": "User role updated successfully",
  "id": "<userId>",
  "role": "scout"
}
```

- Errors:
  - `400` — `Invalid role`
  - `404` — `User not found`
  - `401/403` — Auth/RBAC

---

## POST /admin/verify-coach/:id

Mark a user as a verified coach.

- Auth: Bearer (Admin)
- Validation: `param.id` – MongoID
- 200 OK

```json
{
  "msg": "Coach verified successfully",
  "id": "<userId>",
  "verified": { "coach": true }
}
```

- Errors: `404` — `User not found`, `401/403` — Auth/RBAC

---

## POST /admin/verify-scout/:id

Mark a user as a verified scout.

- Auth: Bearer (Admin)
- Validation: `param.id` – MongoID
- 200 OK

```json
{
  "msg": "Scout verified successfully",
  "id": "<userId>",
  "verified": { "scout": true }
}
```

- Errors: `404` — `User not found`, `401/403` — Auth/RBAC

---

## DELETE /admin/users/:id

Delete a user.

- Auth: Bearer (Admin)
- Validation: `param.id` – MongoID
- 200 OK

```json
{ "msg": "User deleted successfully" }
```

- Errors: `404` — `User not found`, `401/403` — Auth/RBAC
