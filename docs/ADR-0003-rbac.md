# ADR-0003 — RBAC Matrix

**Status:** Accepted · **Date:** 2025-11-08

## Decision

- Single role per user: `user | coach | scout | admin`.
- Independent verification flags: `verified.coach`, `verified.scout` (booleans).
- Only admin can change roles and set verification flags.
- Search/visibility may require both role and verification (e.g., advanced search for `verified.scout`).

## Implementation

- Single Source of Truth: `src/domain/constants/roles.ts` (`ROLES`, `Role`, `ROLES_ARRAY`, `isRole`).
- Admin endpoints:
  - `PATCH /admin/roles/:id`
  - `POST /admin/verify-coach/:id`
  - `POST /admin/verify-scout/:id`
  - `DELETE /admin/users/:id`
- Middleware: `isAuth` → `requireRole('admin')` for all admin routes.
- Validation: `param('id').isMongoId()`; for role change also `body('role').isIn(ROLES_ARRAY)`.

## Audit (POC)

- Log `admin.role.changed`, `admin.verify.coach`, `admin.verify.scout` (adminId, targetUserId, meta).

| Capability                        | user | coach\* | scout\* | admin |
| --------------------------------- | :--: | :-----: | :-----: | :---: |
| Register / Login                  |  ✔  |   ✔    |   ✔    |  ✔   |
| Manage own resources              |  ✔  |   ✔    |   ✔    |  ✔   |
| Verify roles (coach/scout)        |  ✖  |   ✖    |   ✖    |  ✔   |
| Player search (advanced)          |  ✖  |   ⚠    |   ✔    |  ✔   |
| Create opportunities/teams/events |  ✖  |   ✔    |   ⚠    |  ✔   |
| System-wide management            |  ✖  |   ✖    |   ✖    |  ✔   |
