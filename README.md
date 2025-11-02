# SportParent

SportParent is a platform that connects **parents**, **scouts**, and **coaches** to real playing opportunities:

- Parents create a player profile (bio, position, strengths, highlight videos) and apply to tryouts/camps.
- Scouts discover players through structured search and verified roles.
- Coaches manage teams, publish opportunities, and track registrations & attendance.

## ✨ Features

- **Express + TypeScript** with strict typing
- **Mongoose** data access (repositories/DA layer)
- **Auth**: login/signup with `bcryptjs` + `jsonwebtoken` (JWT in HttpOnly cookie); logout just clears cookie (no blacklist)
- **Validation** with `express-validator`
- **CORS** whitelist via env
- **Central error shape** via `utils/errors.ts` (`createError`, `NotFoundError`, etc.)

## 📦 Project Structure

    src/
      config/        (dotenv bootstrap + getEnv helper for typed ENV access)
      middleware/    (global error handler; JWT auth guard; role gate; request validator)
      routes/        (route registration per module: auth, users, etc.)
      controllers/   (thin HTTP controllers delegating to services)
      services/      (business/application services: auth, user mgmt)
      dataAccess/    (DAL base + feature-specific data access)
      models/        (persistence models/schemas)
      utils/         (error helpers; logger; simple in-memory cache)

Key files:

- App: `src/app.ts`
- Server: `src/server.ts`
- Routes: adminRoute.ts, authRoute.ts, index.ts, userRoute.ts
- Controllers: adminController.ts, authController.ts, userController.ts
- Middleware: errorHandler.ts, is-Auth.ts, requireRole.ts, validate.ts

## 🔧 Setup

```bash
npm i
cp .env.example .env   # create your env file
```

### Environment variables

- NODE_ENV
- PORT
- MONGODB_URI
- CORS_WHITELIST
- JWT_SECRET
- APP_NAME

> `JWT_SECRET` is required for signing auth tokens.
> `CORS_WHITELIST` should be a comma-separated list (e.g. `http://localhost:5173`).

## ▶️ Run

**Dev**

```bash
npm run dev
```

**Build**

```bash
npm run build
```

**Start (after build)**

```bash
npm start
```

Available scripts:

- `dev` → ts-node-dev --respawn --transpile-only src/server.ts
- `build` → tsc -p tsconfig.json
- `start` → node dist/server.js
- `lint` → eslint . --ext .ts
- `format` → prettier -w .
- `test` → vitest run
- `typecheck` → tsc -p tsconfig.json --noEmit

## 🧩 Auth Flow

- **Signup** → stores hashed password (`bcryptjs`) and returns JWT (cookie `token`).
- **Login** → verifies password and returns JWT (cookie `token`).
- **Logout** → clears cookie only (stateless JWT).

Cookie options:

- `httpOnly: true`, `sameSite: 'Strict'`, `secure: NODE_ENV === 'production'`, `maxAge: 24h`

### Protecting routes

Use `isAuth` middleware:

```ts
import { isAuth } from './middleware/is-auth';
router.get('/me', isAuth, (req, res) =>
  res.json({ userId: (req as any).userId }),
);
```

## 🧪 Validation

Use `express-validator` with a thin `validate` middleware:

```ts
import { body } from 'express-validator';
import validate from './middleware/validate';

router.post(
  '/signup',
  [body('email').isEmail().withMessage('Invalid email')],
  validate,
  handler,
);
```

## ❗ Error Handling

`utils/errors.ts` exposes:

```ts
export const createError =
  (name: string, status: number) =>
  (message = name) => {
    /* ... */
  };
export const NotFoundError = createError('NotFoundError', 404);
export const ValidationError = createError('ValidationError', 400);
```

Throw them in services/controllers; the global error handler will return `{ status: 'error', message }` with `err.status || 500`.

## 🗂 Useful Commands

- Lint: `npm run lint`
- Format: `npm run format`
- Type-check: `npm run typecheck`
- Test: `npm test`

## ✅ Requirements

- Node.js 18+
- Local MongoDB or `MONGODB_URI` connection string

---

> Tip: If you use `lean()` in DA and need `_id`, cast once: `String((doc as any)._id)`, or extend the return type with `_id: Types.ObjectId`.
