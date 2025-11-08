# ADR-0005 — Audit Logging (POC)

**Status:** Accepted · **Date:** 2025-11-02

## Decision

- Log INFO for sensitive admin actions:
  - `admin.role.changed`
  - `admin.verify.coach`
  - `admin.verify.scout`

## Implementation

- Utility: `src/utils/audit.ts` with `logAction(adminId, action, targetUserId, meta?)`.
- Controllers: call `logAction` after successful operations.

## Notes

- POC uses log-only (no DB). Can be extended to persistent audit store later.
