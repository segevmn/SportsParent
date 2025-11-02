# API Contracts — Day 1 (POC)

**Version:** 1.0 (2025-11-02)  
**Scope:** Backend Auth + RBAC baseline

This document aligns with ADR-0002 (Split model: short-lived Access + Refresh in request body). Access is kept in a cookie named `token`. Refresh is _not_ cookie-based on Day 1.

---

## Authentication

### POST /auth/signup

Create a new user.

- **Request (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "Secret123!",
    "username": "user1"
  }
  ```
- **Behavior:**
  - Creates user with single-role policy (`role` defaults to `"user"`).
  - Signs **Access** token and sets it in cookie `token` (HttpOnly recommended by env).
- **Response:**
  ```json
  {
    "message": "registered"
  }
  ```
  > If your client requires the token in body instead of cookie, you may temporarily return `{ "user": <obj>, "token": "<access>" }` — keep projects consistent.

### POST /auth/login

Authenticate user.

- **Request (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "Secret123!"
  }
  ```
- **Behavior:**
  - Signs **Access** token and sets cookie `token` (HttpOnly recommended).
- **Response:**
  ```json
  {
    "message": "ok"
  }
  ```

### POST /auth/refresh

Issue a fresh **Access** token.

- **Transport:** `refreshToken` is provided in the **request body** (not a cookie on Day 1).
- **Request (JSON):**
  ```json
  {
    "refreshToken": "<refresh-jwt>"
  }
  ```
- **Response (JSON):**
  ```json
  {
    "token": "<new-access-jwt>"
  }
  ```
- **Errors:**
  - `401 Unauthorized` if invalid/expired refresh.
  - `404 Not Found` if user not found.

### POST /auth/logout

Log out the current session.

- **Behavior:** Clears the **`token`** cookie using the same cookie options used to set it.
- **Response:** `204 No Content`

---

## Authorization (RBAC)

- JWT **claims**: `{'email', 'role', 'id'}` (single-role only).
- **Middleware**:
  - `is-Auth` — extracts token from `Authorization: Bearer <access>` **or** cookie `token`.
  - `requireRole('admin')` — enforces admin-only routes.
- **Example route**:
  ```http
  DELETE /admin/users/:id  (protected: isAuth + requireRole('admin'))
  ```

  - `401` if missing/invalid access token.
  - `403` if authenticated but not admin.

---

## Cookies

- **Access Cookie Name:** `token`
- **Cookie Options (typical):**
  - `httpOnly`: `true` (recommended)
  - `sameSite`: `lax`
  - `secure`: `true` in production (`NODE_ENV=production`)
  - `domain`: `${COOKIE_DOMAIN}` (e.g., `localhost`, `app.example.com`)
  - `path`: `/`
- **CORS:** If using cookie from another origin, set `credentials` on client and allow credentials in server CORS config.

> Day 1: **No refresh cookie**. If/when refresh cookie is added, this spec will be amended to include cookie name and CSRF/rotation considerations.

---

## Error model

- Validation errors: `400` with `{ "errors": [{ "msg": "...", "param": "...", ... }] }` (see `validate` middleware).
- Unauthorized: `401` with structured error (see `UnauthorizedError`).
- Forbidden: `403` when role is insufficient (see `requireRole`).
- Not found: `404` if entity not found.
- Server error: `500` when unhandled error occurs.

---

## Notes

- `JWT_EXPIRES_IN` controls Access TTL (e.g., `15m`).
- (Optional) `REFRESH_EXPIRES_IN` controls refresh TTL (default `'7d'` if unset).
- Keep client consistent: cookie-based Access + body-based Refresh on Day 1.
