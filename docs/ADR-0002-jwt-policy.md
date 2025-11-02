# ADR-0002 — JWT Policy (Access + Refresh)

**Status:** Accepted  
**Date:** 2025-11-02  
**Owners:** Backend

## Context

We need short-lived authorization with minimal friction for users and a simple, explicit implementation for the POC. The codebase currently issues a short-lived **Access Token** and supports a **Refresh** endpoint to mint a new Access Token when it expires. Access is kept in a cookie for convenience with existing middleware; Refresh is passed in the request body for `/auth/refresh` (no cookie for refresh at Day 1).

## Decision

Adopt a **Split model**:

- **Access Token (JWT)** — short-lived (`JWT_EXPIRES_IN`), stored in **Cookie `token`** (sent as `Authorization: Bearer` is also supported by middleware via header or cookie).
- **Refresh flow** — `/auth/refresh` accepts a **refreshToken in the request body**, verifies it, loads the user, and returns a fresh Access Token. _Refresh is not stored in a cookie in Day 1._
- **Logout** — clears the `token` cookie (`204 No Content`). Since Refresh is not cookie-based at Day 1, there is nothing server-side to clear for refresh.

This aligns with current code and keeps the project on track for Day 1. Token Rotation / Session Store are deferred to later phases.

## Details

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

- `JWT_SECRET` — Access signing key (required).
- `JWT_REFRESH_SECRET` — Refresh signing key (required).
- `JWT_EXPIRES_IN` — Access TTL (e.g., `15m`) (required).
- `REFRESH_EXPIRES_IN` — Refresh TTL (e.g., `7d`) (optional; default used if absent).
- `NODE_ENV` — `development` | `production` (controls cookie `secure`).
- `COOKIE_DOMAIN` — Domain for cookie clearing/setting (e.g., `localhost`, `app.example.com`).

> Day 1 stores refresh in the request body; there is **no** `REFRESH_COOKIE_NAME` yet. If/when we move refresh to an HttpOnly cookie, a follow-up ADR will add cookie name and CSRF considerations.

## Security Notes (Day 1)

- Access is short-lived and can be cleared at logout via cookie.
- Refresh is body-based: clients must store it securely (not in localStorage if avoidable).
- CORS must allow credentials only if cookie is used for Access; otherwise default header-based flow works as well.
- CSRF: Not required for `/auth/refresh` at Day 1 since refresh is not cookie-based. When migrating to Refresh Cookie, CSRF/SameSite=Strict/`state` measures will be introduced in a new ADR.

## Alternatives Considered

- **Access-only (no refresh):** Simpler but worse UX (frequent re-login). Rejected for POC UX.
- **Refresh Cookie (HttpOnly) from Day 1:** Best practice long-term but requires extra infra (cookie/CORS/CSRF hardening). Deferred to Day 2+.

## Consequences

- Users remain logged in seamlessly via `/auth/refresh`.
- Minimal changes to existing controllers/middleware (keeps DRY).
- Future work: add refresh rotation and server-side session revocation.

## Alignment with API Contracts

- `POST /auth/login` — sets `token` cookie and returns `{ message: "ok" }` (or `{ user, token }` if header-based flow used).
- `POST /auth/refresh` — expects `{ refreshToken }` in **body**; returns `{ token }`.
- `POST /auth/logout` — clears `token` cookie; returns `204`.
- Protected routes use `is-Auth` and `requireRole` (single-role).
