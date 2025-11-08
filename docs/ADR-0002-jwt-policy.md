# ADR-0002 — JWT Policy (Access + Refresh)

**Status:** Accepted · **Date:** 2025-11-08

## Context

The system issues a short-lived Access Token and supports a Refresh endpoint to mint a new Access Token when it expires. For the POC, refresh is sent in the request body (no refresh cookie).

## Decision

-\*Access Token (JWT):\*\* short-lived (`JWT_EXPIRES_IN`), cookie `token` (also supports Authorization header).

- **Refresh flow:** `POST /auth/refresh` with `refreshToken` in the **request body**; returns `{ token }`.
- **Logout:** clears `token` cookie; `204 No Content`.
- **Role change signal:** on admin role change, server sets `X-Role-Changed: true`; clients then call `/auth/refresh`. \*

## Details

- **Access claims:** `{ id, email, role }` (single-role policy)
- **Refresh claims:** `{ id }`
- **TTL:** `JWT_EXPIRES_IN` (e.g., `15m`) / `REFRESH_EXPIRES_IN` (e.g., `7d`)
- **Rotation/Revocation:** not implemented in POC

### Access Token

- **Claims:** `{ id, email, role }` (single-role policy).
- **TTL:** `JWT_EXPIRES_IN` (e.g., `15m`).
- **Transport:** Cookie named **`token`** (HttpOnly optional per environment), also supported via `Authorization: Bearer` header by `is-Auth` middleware.
- **Usage:** Sent on protected requests; on `401` the client calls `/auth/refresh` and retries.

### Refresh

- **Form:** Signed JWT with minimal payload `{ id }`.
- **TTL:** `REFRESH_EXPIRES_IN` (default `'7d'` if unset).
- **Transport (Day 1):** **Request body** only. No cookie for refresh at this stage.
- **Endpoint:** `POST /auth/refresh` → returns `{ token: "<new access>" }`.
- **Rotation / Revocation:** **Not implemented in Day 1.** Future ADRs will define a session store (Redis/Mongo) and rotation rules.

### Logout

- **Endpoint:** `POST /auth/logout` → clears the **`token`** cookie using the same cookie options (domain/path/sameSite/secure) used on login; returns `204`.

## ENV / Config

- `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EXPIRES_IN`, `REFRESH_EXPIRES_IN`
- `NODE_ENV`, `COOKIE_DOMAIN`

## CORS / Client

- Expose header: `X-Role-Changed` via CORS (`exposedHeaders`).
- Client: upon `X-Role-Changed: true` → call `/auth/refresh` and update UI/permissions.

## Security Notes

- Access is short-lived and cleared on logout.
- Refresh in body: clients should store securely (avoid localStorage if possible).
- If refresh ever moves to HttpOnly cookie, add CSRF/SameSite safeguards in a separate ADR.
